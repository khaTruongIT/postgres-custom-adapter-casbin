import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  AuthorizationRequest,
  Authorizer,
} from '@loopback/authorization';
import {inject, Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import * as casbin from 'casbin';
import IORedis from 'ioredis';
import path from 'path';
import {
  CasbinQueueBindings,
  PostgresAdapterBindings,
  RESOURCE_ID,
} from '../../constants/keys';
import {RoleMappingPermissionRepository} from '../../repositories';
import {getLogger} from '../../utils';
import {PostgresCasbinAdapter} from './postgres-casbin-adapter';

const DEFAULT_SCOPE = 'execute';
const conf = path.resolve(__dirname, './../../../casbin-config/casbin.conf');
const logger = getLogger('casbin.authorizer');

export class CasbinAuthorizationProvider implements Provider<Authorizer> {
  constructor(
    @inject(PostgresAdapterBindings.POSTGRES_ADAPTER)
    public postgresCasbinAdapter: PostgresCasbinAdapter,
    @inject(CasbinQueueBindings.CASBIN_REDIS) public redis: IORedis,
    @repository(RoleMappingPermissionRepository)
    public roleMappingRepository: RoleMappingPermissionRepository,
  ) {}

  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    logger.info(
      'authorizationCtx.principals ==>',
      JSON.stringify(authorizationCtx.principals),
    );
    const subject = authorizationCtx.principals[0].roles.role;

    logger.info('authorizationCtx ==>', JSON.stringify(authorizationCtx));

    const resourceId = await authorizationCtx.invocationContext.get(
      RESOURCE_ID,
      {optional: true},
    );

    const object = resourceId ?? metadata.resource ?? authorizationCtx.resource;

    const request: AuthorizationRequest = {
      subject,
      object,
      action: metadata.scopes?.[0] ?? DEFAULT_SCOPE,
    };

    const allowedRoles = metadata.allowedRoles;

    if (!allowedRoles) return AuthorizationDecision.ALLOW;
    if (allowedRoles.length < 1) return AuthorizationDecision.DENY;

    let allow = false;

    const postgresEnforcer = await casbin.newEnforcer(
      conf,
      this.postgresCasbinAdapter,
    );

    const allowedByRole = await postgresEnforcer.enforce(
      request.subject,
      request.object,
      request.action,
    );

    if (allowedByRole) {
      allow = true;
    }

    if (allow) return AuthorizationDecision.ALLOW;
    else if (allow === false) return AuthorizationDecision.DENY;
    return AuthorizationDecision.ABSTAIN;
  }
}
