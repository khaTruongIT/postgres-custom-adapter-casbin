import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'redis',
  connector: 'redis',
  host: '127.0.0.1',
  port: 6379,
  password: '',
  db: 0,
};

@lifeCycleObserver('datasource')
export class RedisDatasource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'redis';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.redis', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
