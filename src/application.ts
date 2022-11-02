import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent} from '@loopback/authentication-jwt';
import {AuthorizationComponent} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingScope} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {CasbinAuthorizationComponent} from './components';
import {PostgresCasbinAdapter} from './components/casbin';
import {
  BullmqEventBusBindings,
  CasbinQueueBindings,
  PasswordHasherBindings,
  PostgresAdapterBindings,
  REDIS_HOST,
  REDIS_PORT,
  TokenServiceBindings,
} from './constants';
import {DbDataSource, RedisDatasource} from './datasources';
import BullmqEventBus from './event-bus/bullmq-event-bus';
import {MySequence} from './sequence';
import {BcryptHasher, JWTService, RedisService} from './services';
import {configure, createConnection, createQueue} from './utils';
export {ApplicationConfig};

const casbinQueue = createQueue('casbin-event-bus');
const casbinRedis = createConnection(REDIS_HOST, REDIS_PORT);

export class AuthorizeAppApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    //set up datasource
    this.dataSource(DbDataSource);
    this.dataSource(RedisDatasource);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);
    this.component(JWTAuthenticationComponent);
    this.component(CasbinAuthorizationComponent);

    // set up bindings
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PostgresAdapterBindings.POSTGRES_ADAPTER).toClass(
      PostgresCasbinAdapter,
    );
    this.bind(BullmqEventBusBindings.BULLMQ_EVENT_BUS)
      .toClass(BullmqEventBus)
      .inScope(BindingScope.SINGLETON);
    this.bind(CasbinQueueBindings.CASBIN_QUEUE)
      .to(casbinQueue)
      .inScope(BindingScope.SINGLETON);

    this.bind(CasbinQueueBindings.CASBIN_REDIS)
      .to(casbinRedis)
      .inScope(BindingScope.SINGLETON);

    //bind custom service
    this.service(RedisService);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    configure();
  }
}
