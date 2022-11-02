import {Queue, Worker} from 'bullmq';
import IORedis from 'ioredis';
import {AuthorizeAppApplication} from '../application';
import {REDIS_HOST, REDIS_PORT} from '../constants';
import {getLogger} from './logger-config';
const logger = getLogger('redis');

export const createConnection = (host: string, port: number) => {
  logger.info('create new redis connection...', host, port);
  return new IORedis(port, host, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    reconnectOnError: function (err) {
      if (err.message.includes('LOADING')) {
        return 2;
      }
      return 1;
    },
  });
};

export const createQueue = (name: string): Queue => {
  const connection = createConnection(REDIS_HOST, REDIS_PORT);
  return new Queue(name, {connection});
};

export const createWorker = (name: string): Worker => {
  const connection = createConnection(REDIS_HOST, REDIS_PORT);
  return new Worker(name, undefined, {lockDuration: 60000, connection});
};

export const createDefaultDataForQueue = (app: AuthorizeAppApplication) => {};
