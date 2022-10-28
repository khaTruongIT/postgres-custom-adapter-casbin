/* eslint-disable @typescript-eslint/no-explicit-any */
import {Queue} from 'bullmq';
import {getLogger} from '../utils';
// import { REDIS_HOST, REDIS_PORT } from "../constants";
import {createQueue} from '../utils/redis';
import {ICasbinEventBus} from './casbin-event-bus';
import {CasbinModelEvent} from './casbin-model-event';

const logger = getLogger('bullmq-event-bus');

export default class BullmqEventBus implements ICasbinEventBus {
  private queue: Queue = createQueue('casbin-event-bus');

  constructor() {}

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
}
