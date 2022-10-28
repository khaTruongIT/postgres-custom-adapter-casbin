import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {BullmqEventBusBindings} from '../constants';
import {CasbinModelEvent} from '../event-bus';
import BullmqEventBus from '../event-bus/bullmq-event-bus';
import {RoleMappingPermissionRepository} from '../repositories';
import {getLogger} from '../utils';

export interface PolicyData {
  name: string;
  key: number;
  value: string;
}

const logger = getLogger('role-mapping-permission.service');
export class RoleMappingPermissionService {
  constructor(
    @repository(RoleMappingPermissionRepository)
    public roleMappingPermissionRepository: RoleMappingPermissionRepository,
    @inject(BullmqEventBusBindings.BULLMQ_EVENT_BUS)
    public eventBus: BullmqEventBus,
  ) {}

  async update() {
    logger.info(`[update], start function update role mapping permission`);
  }

  async create() {
    logger.info(`[create], start function create role mapping permission`);
  }

  async delete() {
    logger.info(`[delete], start function delete role mapping permission`);
  }

  async loadPermissionsData(): Promise<void> {
    logger.info(`[loadPermissions], start function load permission`);
    const permissionsOfRoles = await this.roleMappingPermissionRepository.find({
      fields: ['id', 'subject', 'object', 'action'],
    });
    logger.info(`permissionsOfRole: ${JSON.stringify(permissionsOfRoles)}`);

    for (const permission of permissionsOfRoles) {
      const lineOfRule = `${permission.subject}, ${permission.object}, ${permission.action}`;
      const string = 'p'.concat(',').concat(lineOfRule);
      const object = {
        id: permission.id.toString(),
        name: permission.subject,
        type: 'created',
        entity: string,
      } as CasbinModelEvent;
      logger.info(`object: ${JSON.stringify(object)}`);
      await this.eventBus.enqueue(object);
    }

    logger.info(`[loadPermissions], end function load permission`);
  }
}
