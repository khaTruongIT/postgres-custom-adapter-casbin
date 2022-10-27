import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  AuthorizationRequest,
  Authorizer,
} from '@loopback/authorization';
import {inject, Provider} from '@loopback/core';
import * as casbin from 'casbin';
import path from 'path';
import {PostgresAdapterBindings, RESOURCE_ID} from '../../constants/keys';
import {getLogger} from '../../utils';
import {PostgresCasbinAdapter} from './postgres-casbin-adapter';
// import {AuthorizeAppApplication} from '../../application';
// const debug = require('debug')('loopback:example:acl');
const DEFAULT_SCOPE = 'execute';
const conf = path.resolve(__dirname, './../../../casbin-config/casbin.conf');
const logger = getLogger('casbin.authorizer');
export class CasbinAuthorizationProvider implements Provider<Authorizer> {
  constructor(
    @inject(PostgresAdapterBindings.POSTGRES_ADAPTER)
    public postgresCasbinAdapter: PostgresCasbinAdapter,
  ) {}

  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    logger.log(
      'authorizationCtx.principals ==>',
      JSON.stringify(authorizationCtx.principals),
    );
    const subject = authorizationCtx.principals[0].roles.role;

    logger.log('authorizationCtx ==>', JSON.stringify(authorizationCtx));

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
    logger.log('request ==>', request);

    const allowedRoles = metadata.allowedRoles;

    if (!allowedRoles) return AuthorizationDecision.ALLOW;
    if (allowedRoles.length < 1) return AuthorizationDecision.DENY;

    let allow = false;

    const postgresEnforcer = await casbin.newEnforcer(
      conf,
      this.postgresCasbinAdapter,
    );

    const testFilter = await postgresEnforcer.getFilteredPolicy(
      0,
      request.subject,
      request.object,
      request.action,
    );

    logger.info(`Test filter ==>`, testFilter);

    const hasPolicy = await postgresEnforcer.hasPolicy(
      request.subject,
      request.object,
      request.action,
    );

    logger.info(`Has policy ==>`, hasPolicy);

    if (!testFilter) return AuthorizationDecision.DENY;

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
