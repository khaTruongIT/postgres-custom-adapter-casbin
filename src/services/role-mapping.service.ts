import {repository} from '@loopback/repository';
import {
  RoleMappingPermissionRepository,
  RoleMappingRepository,
} from '../repositories';
import {getLogger} from '../utils';

const logger = getLogger('role-mapping.service');

export class RoleMappingService {
  constructor(
    @repository(RoleMappingRepository)
    public roleMappingRepository: RoleMappingRepository,
    @repository(RoleMappingPermissionRepository)
    public roleMappingPermissionRepository: RoleMappingPermissionRepository,
  ) {}

  async createRoleMapping() {
    logger.info('[createRoleMapping], start function create role mapping');
  }

  async updateRoleMapping() {
    logger.info('[updateRoleMapping], start function update role mapping');
  }

  async deleteRoleMapping() {
    logger.info('[deleteRoleMapping], start function delete role mapping');
  }
}
