import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {RoleMappingPermission, RoleMappingPermissionRelations} from '../models';

export class RoleMappingPermissionRepository extends DefaultCrudRepository<
  RoleMappingPermission,
  typeof RoleMappingPermission.prototype.id,
  RoleMappingPermissionRelations
> {
  constructor(@inject('datasources.authorize') dataSource: DbDataSource) {
    super(RoleMappingPermission, dataSource);
  }
}
