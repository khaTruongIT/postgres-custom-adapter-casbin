import {Entity, model, property} from '@loopback/repository';
import {TimestampMixin} from '../mixins';

@model()
export class LoginRQ extends Entity {
  @property({
    type: 'string',
  })
  username: string;

  @property({
    type: 'string',
  })
  password: string;
}

@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'user',
    },
  },
})
export class User extends TimestampMixin(Entity) {
  @property({
    type: 'number',
    id: true,
    index: true,
  })
  id: number;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'fullname',
      dataType: 'text',
    },
  })
  fullName?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'email',
      dataType: 'text',
    },
  })
  email: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'username',
      dataType: 'text',
    },
  })
  userName?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'password',
      dataType: 'text',
      nullable: 'NO',
    },
  })
  password: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {}

export type UserWithRelations = User & UserRelations;
