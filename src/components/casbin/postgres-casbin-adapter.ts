import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Adapter, Helper, Model} from 'casbin';
import IORedis from 'ioredis';
import {CasbinQueueBindings} from '../../constants';
import {
  PermissionRepository,
  RoleMappingPermissionRepository,
  RoleRepository,
} from '../../repositories';
import {RedisService} from '../../services';
import {getLogger} from '../../utils';

const logger = getLogger('postgres-casbin-adapter');

export class PostgresCasbinAdapter implements Adapter {
  constructor(
    @repository(PermissionRepository)
    private permissionRepository: PermissionRepository,
    @repository(RoleMappingPermissionRepository)
    private roleMappingPermissionRepository: RoleMappingPermissionRepository,
    @repository(RoleRepository) public roleRepository: RoleRepository,
    @service(RedisService) public redisService: RedisService,
    @inject(CasbinQueueBindings.CASBIN_REDIS) public redis: IORedis, // @inject('services.RoleMappingPermissionService') // public roleMappingPermissionService: RoleMappingPermissionService,
  ) {}

  public async loadPolicy(model: Model): Promise<void> {
    await this.loadRules(model, Helper.loadPolicyLine);
  }

  private async loadRules(
    model: Model,
    handler: (line: string, model: Model) => void,
  ): Promise<void> {
    const policy = await this.getData();
    if (policy) {
      const rules = policy.split('\n');
      rules.forEach((n: string, index: number) => {
        if (!n) {
          return;
        }
        handler(n, model);
      });
    }
  }

  public async getData() {
    const roleNames = await this.roleRepository.find({
      fields: ['id', 'role'],
    });
    let rule = '';
    for (const rl of roleNames) {
      // get value in redis
      const value = await this.redis.get(rl.role);
      logger.info(`value: ${value}`);
      if (value && JSON.parse(value).length > 0) {
        const string = this.loadPermissions(value);
        rule = rule + string;
      }
      if (!value) {
        // get permission of roles
        // set key and value to redis
        const string = await this.setPermissionsOfRole(rl.role);
        rule = rule + string;
      }
      if (value && JSON.parse(value).length === 0) {
        rule = rule + '';
      }
    }
    return rule;
  }

  public loadPermissions(value: string): string {
    const permissionOfRoles = JSON.parse(value);
    let string = '';
    for (const permission of permissionOfRoles) {
      const lineOfRule = `${permission.subject}, ${permission.object}, ${permission.action}`;
      const newString = 'p'.concat(',').concat(lineOfRule).concat('\n');
      string = string + newString;
    }
    return string;
  }

  public async setPermissionsOfRole(name: string) {
    logger.info(
      `[serPermissionOfRole], start function set permission of role name: ${name}`,
    );
    let string = '';
    const dataOfName = await this.roleMappingPermissionRepository.find({
      fields: ['id', 'subject', 'object', 'action'],
      where: {
        subject: name,
      },
    });
    if (!dataOfName) {
      return this.redis.setnx(`${name}`, JSON.stringify([]));
    }
    await this.redis.setnx(`${name}`, JSON.stringify(dataOfName));
    for (const data of dataOfName) {
      const lineOfRule = `${data.subject}, ${data.object}, ${data.action}`;
      const newString = 'p'.concat(',').concat(lineOfRule).concat('\n');
      string = string + newString;
    } 
    return string;
  }

  public async savePolicy(model: Model): Promise<boolean> {
    throw new Error('not implemented');
  }

  public async addPolicy(
    sec: string,
    ptype: string,
    rule: string[],
  ): Promise<void> {
    throw new Error('not implemented');
  }

  public async removeFilteredPolicy(
    sec: string,
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<void> {
    throw new Error('not implemented');
  }

  public async removePolicy(
    sec: string,
    ptype: string,
    rule: string[],
  ): Promise<void> {
    throw new Error('not implemented');
  }
}
