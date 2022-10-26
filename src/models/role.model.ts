import {Entity, model, property} from '@loopback/repository';
import {TimestampMixin} from '../mixins';

@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'role',
    },
  },
})
export class Role extends TimestampMixin(Entity) {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  role: string;

  @property({
    type: 'string',
  })
  description: string;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {}

export type RoleWithRelations = Role & RoleRelations;
