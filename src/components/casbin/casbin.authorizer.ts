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
import path from 'path';
import {RESOURCE_ID} from '../../constants/keys';
import {
  PermissionRepository,
  RoleMappingPermissionRepository,
} from '../../repositories';
import {PostgresCasbinAdapter} from './postgres-casbin-adapter';
// import {AuthorizeAppApplication} from '../../application';
// const debug = require('debug')('loopback:example:acl');
const DEFAULT_SCOPE = 'execute';
const conf = path.resolve(__dirname, './../../../casbin-config/casbin.conf');

export class CasbinAuthorizationProvider implements Provider<Authorizer> {
  constructor(
    @inject('casbin.enforcer.factory')
    private enforcerFactory: (name: string) => Promise<casbin.Enforcer>,
    @repository(PermissionRepository)
    private permissionRepository: PermissionRepository,
    @repository(RoleMappingPermissionRepository)
    private roleMappingPermissionRepository: RoleMappingPermissionRepository,
  ) {}

  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    console.info(
      'authorizationCtx.principals ==>',
      authorizationCtx.principals,
    );
    const subject = authorizationCtx.principals[0].roles.role;

    console.log('authorizationCtx ==>', authorizationCtx);

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
    console.log('request ==>', request);

    const allowedRoles = metadata.allowedRoles;

    if (!allowedRoles) return AuthorizationDecision.ALLOW;
    if (allowedRoles.length < 1) return AuthorizationDecision.DENY;

    let allow = false;

    const postgresAdapter = new PostgresCasbinAdapter(
      this.permissionRepository,
      this.roleMappingPermissionRepository,
    );
    const postgresEnforcer = await casbin.newEnforcer(conf, postgresAdapter);
    console.log('postgresEnforcer ==>', postgresEnforcer);

    const allowedByRole = await postgresEnforcer.enforce(
      request.subject,
      request.object,
      request.action,
    );

    if (allowedByRole) {
      allow = true;
    }
    // An optimization for ONLY searching among the allowed roles' policies
    // for (const role of allowedRoles) {
    //   const enforcer = await this.enforcerFactory(role);

    //   const allowedByRole = await enforcer.enforce(
    //     request.subject,
    //     request.object,
    //     request.action,
    //   );

    //   if (allowedByRole) {
    //     allow = true;
    //     break;
    //   }
    // }

    if (allow) return AuthorizationDecision.ALLOW;
    else if (allow === false) return AuthorizationDecision.DENY;
    return AuthorizationDecision.ABSTAIN;
  }
}
