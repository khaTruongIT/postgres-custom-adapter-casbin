import {Entity, model, property} from '@loopback/repository';
import {TimestampMixin} from '../mixins';

@model({
  settings: {
    postgres: {
      schema: 'public',
      table: 'permission',
    },
  },
})
export class Permission extends TimestampMixin(Entity) {
  @property({
    type: 'number',
    id: true,
    generated: true,
    index: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  action: string;

  @property({
    type: 'string',
  })
  object?: string;

  constructor(data?: Partial<Permission>) {
    super(data);
  }
}

export interface PermissionRelations {}
export type PermissionWithRelations = Permission & PermissionRelations;
