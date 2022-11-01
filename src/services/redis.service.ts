import IORedis from 'ioredis';
import {getLogger} from '../utils';

const logger = getLogger('redis.service');

export class RedisService {
  private redis: IORedis;
  constructor() {}

  // set key and value ---> update
  async set(key: string, value: string | number | Buffer): Promise<boolean> {
    logger.info(`[set], start function set key and value`);
    const result = await this.redis.set(key, value);
    logger.info(`[set], key: ${key}, value: ${value}`);
    return result === 'OK';
  }

  // async get key and value -->
  async get<TypeOfValue>(key: string): Promise<TypeOfValue | null> {
    try {
      logger.info(`Start function get key: ${key}`);
      const value = await this.redis.get(key);
      logger.info(`Value of ${key}: ${JSON.stringify(value)}`);
      if (value) {
        const data = JSON.parse(value) as TypeOfValue;
        return data;
      } else {
        return null;
      }
    } catch (err) {
      logger.error(
        `Error get value of key:${key}, error: ${JSON.stringify(err)}`,
      );
      throw err;
    }
  }
  // delete key and value
  async delete(key: string) {
    logger.info(`[delete], delete key: ${key}`);
    return this.redis.del(key);
  }
}
