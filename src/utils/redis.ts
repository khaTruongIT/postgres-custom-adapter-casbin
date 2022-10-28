import {Queue, Worker} from 'bullmq';
import IORedis from 'ioredis';
import {AuthorizeAppApplication} from '../application';
import {getLogger} from './logger-config';

const logger = getLogger('redis');

const host = 'localhost';
const port = 6379;

export const createConnection = () => {
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
  const connection = createConnection();
  return new Queue(name, {connection});
};

export const createWorker = (name: string): Worker => {
  const connection = createConnection();
  return new Worker(name, undefined, {lockDuration: 60000, connection});
};

export const createDefaultDataForQueue = (app: AuthorizeAppApplication) => {

}
