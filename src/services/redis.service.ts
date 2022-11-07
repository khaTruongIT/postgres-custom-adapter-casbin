import {inject} from '@loopback/core';
import IORedis from 'ioredis';
import {CasbinQueueBindings} from '../constants';
import {getLogger} from '../utils';
// import {RoleMappingPermissionService} from './role-mapping-permission.service';

const logger = getLogger('redis.service');

export class RedisService {
  constructor(
    @inject(CasbinQueueBindings.CASBIN_REDIS) public redis: IORedis, // @inject('services.RoleMappingPermissionService') // public roleMappingPermissionService: RoleMappingPermissionService,
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
    const data = await this.redis.get(key);
    if (data) {
      return data;
    } else {
      return null;
    }
  }
  // delete key and value
  async delete(key: string) {
    logger.info(`[delete], delete key: ${key}`);
    return this.redis.del(key);
  }
}
