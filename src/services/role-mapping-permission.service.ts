import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {BullmqEventBusBindings} from '../constants';
// import {CasbinModelEvent} from '../event-bus';
import BullmqEventBus from '../event-bus/bullmq-event-bus';
import {RoleMappingPermission} from '../models';
import {RoleMappingPermissionRepository, RoleRepository} from '../repositories';
import {getLogger} from '../utils';
import {RedisService} from './redis.service';

const logger = getLogger('role-mapping-permission.service');
export class RoleMappingPermissionService {
  constructor(
    @repository(RoleMappingPermissionRepository)
    public roleMappingPermissionRepository: RoleMappingPermissionRepository,
    @repository(RoleRepository) public roleRepository: RoleRepository,
    @inject(BullmqEventBusBindings.BULLMQ_EVENT_BUS)
    public eventBus: BullmqEventBus,
    @service(RedisService) public redisService: RedisService,
  ) {}

  async updateRoleMappingPermissionById(
    id: number,
    req: RoleMappingPermission,
  ) {}

  async create() {
    logger.info(`[create], start function create role mapping permission`);
  }

  async delete() {
    logger.info(`[delete], start function delete role mapping permission`);
  }

  // async loadPermissionsData(): Promise<void> {
  //   logger.info(`[loadPermissions], start function load permission`);
  //   const permissionsOfRoles = await this.roleMappingPermissionRepository.find({
  //     fields: ['id', 'subject', 'object', 'action'],
  //   });
  //   logger.info(`permissionsOfRole: ${JSON.stringify(permissionsOfRoles)}`);

  //   for (const permission of permissionsOfRoles) {
  //     const lineOfRule = `${permission.subject}, ${permission.object}, ${permission.action}`;
  //     const string = 'p'.concat(',').concat(lineOfRule);
  //     const object = {
  //       id: permission.id.toString(),
  //       name: permission.subject,
  //       type: 'created',
  //       entity: string,
  //     } as CasbinModelEvent;
  //     logger.info(`object: ${JSON.stringify(object)}`);
  //     await this.eventBus.enqueue(object);
  //   }

  //   logger.info(`[loadPermissions], end function load permission`);
  // }

  async getPermissionByRoleName(roleName: string) {
    try {
      logger.info(
        `[getPermissionByRoleName], start function get permission by role name: ${roleName}`,
      );
      const permissionsOfRoleName =
        await this.roleMappingPermissionRepository.find({
          where: {
            subject: roleName,
          },
          fields: ['id', 'subject', 'object', 'action'],
        });
      logger.info(
        `permissionsOfRoleName: ${JSON.stringify(permissionsOfRoleName)}`,
      );
      return permissionsOfRoleName;
    } catch (err) {
      logger.error(`Error get permission by role name: ${JSON.stringify(err)}`);
      throw err;
    }
  }

  // get key and value cached in redis
  async getKey(id: string) {
    logger.info(`[GETKEY], start function get key:${id}`);
    try {
      const data = await this.redisService.get(id);
      logger.info(`data: ${JSON.stringify(data)}`);
      return data;
    } catch (err) {
      logger.error(`Error get value of key:${id}, err: ${JSON.stringify(err)}`);
      throw err;
    }
  }

  async setDataFromDb() {
    logger.info(`[setDataFromDb]`);
  }
}
