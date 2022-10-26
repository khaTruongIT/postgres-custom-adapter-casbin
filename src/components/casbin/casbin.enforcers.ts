import * as casbin from 'casbin';
import _ from 'lodash';
import path from 'path';
import {AuthorizeAppApplication} from '../../application';
import {
  RoleMappingPermission,
  RoleMappingPermissionRelations,
  User,
} from '../../models';
import {
  PermissionRepository,
  RoleMappingRepository,
  RoleRepository,
  UserRepository,
} from '../../repositories';
import {RoleMappingPermissionRepository} from '../../repositories/role-mapping-permission.repository';

const POLICY_PATHS = {
  admin: './../../../casbin-config/casbin.policy.admin.csv',
  owner: './../../../casbin-config/casbin.policy.owner.csv',
  team: './../../../casbin-config/casbin.policy.team_member.csv',
};

export async function getCasbinEnforcerByName(
  name: string,
): Promise<casbin.Enforcer | undefined> {
  const CASBIN_ENFORCERS: {[key: string]: Promise<casbin.Enforcer>} = {
    admin: createEnforcerByRole(POLICY_PATHS.admin),
    owner: createEnforcerByRole(POLICY_PATHS.owner),
    team: createEnforcerByRole(POLICY_PATHS.team),
  };
  if (Object.prototype.hasOwnProperty.call(CASBIN_ENFORCERS, name))
    return CASBIN_ENFORCERS[name];
  return undefined;
}

export async function createEnforcerByRole(
  policyPath: string,
): Promise<casbin.Enforcer> {
  const conf = path.resolve(__dirname, './../../../casbin-config/casbin.conf');
  const policy = path.resolve(__dirname, policyPath);
  return casbin.newEnforcer(conf, policy);
}

// export async function createEnforcerFromArray(
//   request: Policy[],
// ): Promise<casbin.Enforcer> {
//   // path of config
//   const conf = path.resolve(__dirname, './../../../casbin-config/casbin.conf');

//   const policy = formatPolicyLine(request);
//   const newPolicy = new CustomCasbinAdapter(policy);
//   const newEnforcer = casbin.newEnforcer(conf, newPolicy);
//   return newEnforcer;
// }

export async function createEnforcerFromDb(
  app: AuthorizeAppApplication,
): Promise<casbin.Enforcer> {
  // path of config
  const conf = path.resolve(__dirname, './../../../casbin-config/casbin.conf');
  const policy = await createPolicyFromDb(app);
  const enforcer = casbin.newEnforcer(conf, policy);
  return enforcer;
}

export async function createPolicyFromDb(app: AuthorizeAppApplication) {
  const roleRepository = await app.getRepository(RoleRepository);
  const roleMappingRepository = await app.getRepository(RoleMappingRepository);
  const permissionRepository = await app.getRepository(PermissionRepository);
  const roleMappingPermissionRepository = await app.getRepository(
    RoleMappingPermissionRepository,
  );
  const userRepository = await app.getRepository(UserRepository);

  let rulesOfAdmin = '';

  // find roleid of admin
  const roleIdOfAdmin = await roleRepository.find({
    where: {
      role: {
        like: '%admin%',
      },
    },
  });

  const roleId = _.get(roleIdOfAdmin, '0.id');

  // find account which role is admin
  const userIds = await roleMappingRepository.find({
    where: {
      roleId,
    },
    fields: ['id', 'userId'],
  });

  // find permission of role admin
  const permissionIdsOfAdmin = await roleMappingPermissionRepository.find({
    where: {
      roleId,
    },
  });

  for (const ur of userIds) {
    const user = await userRepository.findById(ur.userId);
    const policyOfUser = await createPolicyFromUser(
      user,
      permissionIdsOfAdmin,
      permissionRepository,
    );
    rulesOfAdmin = rulesOfAdmin + policyOfUser;
  }
  return rulesOfAdmin;
}

export async function createPolicyFromUser(
  user: User,
  permissionIds: (RoleMappingPermission & RoleMappingPermissionRelations)[],
  permissionRepository: PermissionRepository,
): Promise<string> {
  let string = '';
  for (const pr of permissionIds) {
    const fullName = user.fullName ?? '';
    const permission = await permissionRepository.findById(pr.permissionId);
    const permissionObject = permission.object ?? '';
    const permissionAction = permission.action ?? '';
    const newString = 'p'
      .concat(',')
      .concat(fullName)
      .concat(',')
      .concat(permissionObject)
      .concat('')
      .concat(permissionAction)
      .concat('\n');
    string = string + newString;
  }
  return string;
}
