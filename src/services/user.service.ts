/* eslint-disable prefer-const */
// /projects/list-projects
// guest, admin, owner, teamMember
// /projects/view-all
// admin
// /projects/{id}/show-balance
// owner, teamMember
// /projects/{id}/donate
// admin, owner, teamMember
// /projects/{id}/withdraw
// owner

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import _ from 'lodash';
import {BcryptHasher, JWTService} from '.';
import {PasswordHasherBindings, TokenServiceBindings} from '../constants';
import {User} from '../models';
import {
  AccessTokenRepository,
  PermissionRepository,
  RoleMappingRepository,
  RoleRepository,
  UserRepository,
} from '../repositories';
import {RoleMappingPermissionRepository} from '../repositories/role-mapping-permission.repository';
import {getLogger} from '../utils';

export type UserCredentials = {
  username: string;
  password: string;
};

export type Permission = {
  subject: string;
  object: string;
  action: string;
};

const logger = getLogger('user.service');

export class UserService {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(AccessTokenRepository)
    public accessTokenRepository: AccessTokenRepository,
    @repository(RoleMappingRepository)
    public roleMappingRepository: RoleMappingRepository,
    @repository(RoleRepository) public roleRepository: RoleRepository,
    @repository(RoleMappingPermissionRepository)
    public roleMappingPermissionRepository: RoleMappingPermissionRepository,
    @repository(PermissionRepository)
    public permissionRepository: PermissionRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
  ) {}
  async verifyCredentials(userCredentials: UserCredentials): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {userName: userCredentials.username},
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized('User not found');
    }
    const checkPassword = await this.hasher.comparePassword(
      userCredentials.password,
      foundUser.password,
    );
    if (!checkPassword) {
      throw new HttpErrors.Unauthorized('Password is not valid');
    }
    return foundUser;
  }

  async convertToUserProfile(user: User): Promise<UserProfile> {
    const {id, fullName, email, userName} = user;

    const roleMappingUser = await this.roleMappingRepository.find({
      where: {
        userId: id,
      },
      fields: ['id', 'roleId', 'userId'],
    });
    logger.log(`roleMappingUser: ${JSON.stringify(roleMappingUser)}`);

    // get role of user
    const roleOfUser = await this.roleRepository.find({
      where: {
        id: _.get(roleMappingUser, '0.roleId'),
      },
    });
    logger.log(`roleOfUser: ${JSON.stringify(roleOfUser)}`);

    const permissionOfRoles = await this.roleMappingPermissionRepository.find({
      where: {
        roleId: _.get(roleMappingUser, '0.roleId'),
      },
      fields: ['id', 'permissionId', 'object', 'subject', 'action'],
    });

    const permissions: Permission[] = [];

    for (const permissionOfRole of permissionOfRoles) {
      const object: Permission = {
        subject: permissionOfRole.subject ?? '',
        action: permissionOfRole.action ?? '',
        object: permissionOfRole.object,
      };
      permissions.push(object);
    }

    let userProfile: UserProfile;
    userProfile = Object.assign({
      id,
      fullName,
      email,
      userName,
      roles: roleOfUser[0],
      permissions,
    });
    return userProfile;
  }

  async createUser(userRequest: User) {
    logger.log(`userRequest ==> ${JSON.stringify(userRequest)}`);

    const encryptPassword = await this.hasher.hashPassword(
      userRequest.password,
    );

    const userRS = new User({
      id: userRequest.id,
      fullName: userRequest.fullName,
      userName: userRequest.userName,
      email: userRequest.email,
      createdAt: userRequest.createdAt,
      updatedAt: userRequest.updatedAt,
      password: encryptPassword,
    });

    const newUser = await this.userRepository.create(userRS);
    return newUser;
  }

  async login(userCredentials: UserCredentials) {
    const user = await this.verifyCredentials(userCredentials);
    const userProfile = await this.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return {
      token,
      user: userProfile,
      company: userProfile.company,
    };
  }
}
