import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {RoleMapping, RoleMappingRelations} from '../models';

export class RoleMappingRepository extends DefaultCrudRepository<
  RoleMapping,
  typeof RoleMapping.prototype.id,
  RoleMappingRelations
> {
  constructor(@inject('datasources.authorize') dataSource: DbDataSource) {
    super(RoleMapping, dataSource);
  }

  //TODO: create role mapping
  async createRoleMapping() {}

  
}
