/* eslint-disable @typescript-eslint/no-explicit-any */
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Queue} from 'bullmq';
import {CasbinQueueBindings} from '../constants';
import {RoleMappingPermissionRepository} from '../repositories';
import {getLogger} from '../utils';
import {ICasbinEventBus} from './casbin-event-bus';
import {CasbinModelEvent} from './casbin-model-event';

const logger = getLogger('bullmq-event-bus');

export default class BullmqEventBus implements ICasbinEventBus {
  constructor(
    @repository(RoleMappingPermissionRepository)
    public roleMappingPermissionRepository: RoleMappingPermissionRepository,
    @inject(CasbinQueueBindings.CASBIN_QUEUE) public queue: Queue,
  ) {}

  async enqueue(event: CasbinModelEvent<any, any>) {
    try {
      logger.info(`[enqueue], event: ${JSON.stringify(event)}`);
      await this.queue.add(event.name, event, {
        jobId: event.id,
      });
    } catch (err) {
      logger.error(`Error: ${JSON.stringify(err)}`);
      throw err;
    }
  }

  dequeue(): void {}

  // set first data from db
  async init() {
    logger.info(`[init], start function load data from db`);
    try {
      // const permissionOfRoles = await this.roleMappingPermissionRepository.find(
      //   {
      //     fields: ['id', 'subject', 'object', 'action'],
      //   },
      // );
      // logger.info(`permissinonOfRoles: ${JSON.stringify(permissionOfRoles)}`);
      // for (const permission of permissionOfRoles) {
      //   const lineOfRule = `${permission.subject}, ${permission.object}, ${permission.action}`;
      //   const string = 'p'.concat(',').concat(lineOfRule);
      //   const object = {
      //     id: permission.id.toString(),
      //     name: permission.subject,
      //     type: 'created',
      //     entity: string,
      //   } as CasbinModelEvent;
      //   logger.info(`object: ${JSON.stringify(object)}`);
      //   await this.enqueue(object);
      // }
    } catch (err) {
      logger.error(`Error: ${JSON.stringify(err)}`);
      throw err;
    }
  }
}
