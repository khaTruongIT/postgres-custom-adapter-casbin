import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Migration, MigrationRelations} from '../models';

export class MigrationRepository extends DefaultCrudRepository<
  Migration,
  typeof Migration.prototype.id,
  MigrationRelations
> {
  constructor(@inject('datasources.authorize') dataSource: DbDataSource) {
    super(Migration, dataSource);
  }
}
