import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {ApplicationKeys} from '../constants';

const config = {
  name: ApplicationKeys.DB_DATASOURCE,
  connector: 'postgresql',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'authorize',
};

@lifeCycleObserver('datasource')
export class DbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = ApplicationKeys.DB_DATASOURCE;
  static readonly defaultConfig = config;

  constructor(
    @inject(`datasources.config.${ApplicationKeys.DB_DATASOURCE}`, {
      optional: true,
    })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
