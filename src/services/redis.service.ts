import {inject} from '@loopback/core';
import IORedis from 'ioredis';
import {CasbinQueueBindings} from '../constants';
import {getLogger} from '../utils';

const logger = getLogger('redis.service');

export class RedisService {
  constructor(
    @inject(CasbinQueueBindings.CASBIN_REDIS) public redis: IORedis,
  
  ) {}

  // set key and value ---> update
  async set(key: string, value: string | number | Buffer): Promise<boolean> {
    logger.info(`[set], start function set key and value`);
    const result = await this.redis.set(key, value);
    logger.info(`[set], key: ${key}, value: ${value}`);
    return result === 'OK';
  }

  async getKeys(patternOfKey: string): Promise<string[]> {
    try {
      logger.info(
        `[GETKEY], start function get key, patterOfKey: ${patternOfKey}`,
      );
      const keys = await this.redis.keys(patternOfKey);
      logger.info(`Keys: ${JSON.stringify(keys)}`);
      return keys;
    } catch (err) {
      logger.error(
        `[GETKEY], error getKey, pattern: ${patternOfKey}, error: ${JSON.stringify(
          err,
        )}`,
      );
      throw err;
    }
  }

  // async get key and value -->
  async get(key: string): Promise<string | null> {
    try {
      logger.info(`Start function get key: ${key}`);
      const value = await this.redis.hgetall(key);
      logger.info(`Value of ${key}: ${JSON.stringify(value)}`);
      if (value) {
        const data = value.data;
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

  // get data from db and set default key and value
  async setData() {
    const data = await this.
    await this.redis.hmset(

    );
  }
}
