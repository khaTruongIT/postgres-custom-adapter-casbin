import {TokenService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {PostgresCasbinAdapter} from '../components/casbin';
import BullmqEventBus from '../event-bus/bullmq-event-bus';
import {PasswordHasher} from '../services';

export class ApplicationKeys {
  static readonly DB_DATASOURCE = 'authorize';
}

export class Authentication {
  // Jwt
  static readonly ACCESS_TOKEN_SECRET = 'ZGV2LWRhaWx5bWlsZG8=';
  static readonly APPLICATION_ACCESS_TOKEN_EXPIRES_IN = 86400;
  static readonly REFRESH_TOKEN_SECRET = 'ZGV2LWRhaWx5bWlsZG8tc2VjcmV0LWtleQ==';
  static readonly DEFAULT_TTL = 1 * 24 * 60 * 60 * 7 * 2;
  static readonly TYPE_BEARER = 'Bearer';
  static readonly TYPE_BASIC = 'Basic';
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER =
    BindingKey.create<PasswordHasher>('services.hasher');
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace PostgresAdapterBindings {
  export const POSTGRES_ADAPTER = BindingKey.create<PostgresCasbinAdapter>(
    'casbin.postgres.adapter',
  );
}

export const RESOURCE_ID = BindingKey.create<string>('resourceId');

export type Policy = {
  subject: string;
  object: string;
  action: string;
};

export namespace BullmqEventBusBindings {
  export const BULLMQ_EVENT_BUS =
    BindingKey.create<BullmqEventBus>('bullmq.event.bus');
}
