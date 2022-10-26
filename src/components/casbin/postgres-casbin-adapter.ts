import {repository} from '@loopback/repository';
import {Adapter, Helper, Model} from 'casbin';
import {
  PermissionRepository,
  RoleMappingPermissionRepository,
} from '../../repositories';
// import {AuthorizeAppApplication} from '../../application';

export class PostgresCasbinAdapter implements Adapter {
  constructor(
    @repository(PermissionRepository)
    private permissionRepository: PermissionRepository,
    @repository(RoleMappingPermissionRepository)
    private roleMappingPermissionRepository: RoleMappingPermissionRepository,
  ) {}

  public async loadPolicy(model: Model): Promise<void> {
    const policies = await this.loadPermissions();
    if (!policies) {
      throw new Error('Invalid policy, policy document cannot be false-y');
    }
    await this.loadRules(model, Helper.loadPolicyLine);
  }

  private async loadRules(
    model: Model,
    handler: (line: string, model: Model) => void,
  ): Promise<void> {
    const policy = await this.loadPermissions();
    if (policy) {
      const rules = policy.split('\n');
      console.log('rules =>', rules);
      rules.forEach((n: string, index: number) => {
        if (!n) { 
          return;
        }
        handler(n, model);
      });
    }
  }

  public async loadPermissions(): Promise<string> {
    const permissionsOfRole = await this.roleMappingPermissionRepository.find();
    let string = '';
    for (const permission of permissionsOfRole) {
      const lineOfRule = `${permission.subject}, ${permission.object}, ${permission.action}`;
      const newString = 'p'.concat(',').concat(lineOfRule).concat('\n');
      console.log('newString ===>', newString);
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
