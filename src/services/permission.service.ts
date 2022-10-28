import {repository} from '@loopback/repository';
import {PermissionRepository} from '../repositories';
import {getLogger} from '../utils';

const logger = getLogger('permission.service');

export class PermissionService {
  constructor(
    @repository(PermissionRepository)
    public permissionRepository: PermissionRepository,
  ) {}

  async create() {
    logger.info(`[create], start function create`);
  }

  async update() {
    logger.info(`[update], start function update`);
  }

  async delete() {
    logger.info(`[delete], start function delete`);
  }
}
