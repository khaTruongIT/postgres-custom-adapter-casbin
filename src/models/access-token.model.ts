/* eslint-disable @typescript-eslint/no-explicit-any */
import {User} from './user.model';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {TimestampMixin} from '../mixins';

@model({
  settings: {},
})
export class AccessToken extends TimestampMixin(Entity) {
  @property({
    type: 'string',
    postgresql: {
      columnName: 'data',
      dataType: 'text',
    },
  })
  data?: any;

  @property({
    type: 'string',
    id: true,
    postgresql: {
      columnName: 'id',
      dataType: 'text',
      nullable: 'NO',
    },
  })
  id: string;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'ttl',
    },
  })
  ttl?: number;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'scopes',
      dataType: 'text',
    },
  })
  scopes?: string;

  @belongsTo(() => User, {
    keyFrom: 'userId',
  })
  userId?: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface AccessTokenRelations {}

export type AccessTokenWithRelations = AccessToken & AccessTokenRelations;
