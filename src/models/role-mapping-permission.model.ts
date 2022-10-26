import {Entity, model, property} from '@loopback/repository';
import {TimestampMixin} from '../mixins';

@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'rolemappingpermission',
    },
  },
})
export class RoleMappingPermission extends TimestampMixin(Entity) {
  @property({
    type: 'number',
    id: true,
    generated: true,
    required: true,
  })
  id: number;

  @property({
    type: 'number',
    required: true,
  })
  roleId: number;

  @property({
    type: 'number',
    required: true,
  })
  permissionId: number;

  @property({
    type: 'string',
  })
  subject: string;

  @property({
    type: 'string',
  })
  object: string;

  @property({
    type: 'string',
  })
  action: string;

  constructor(data?: Partial<RoleMappingPermission>) {
    super(data);
  }
}

export interface RoleMappingPermissionRelations {}

export type RoleMappingPermissionWithRelations = RoleMappingPermission &
  RoleMappingPermissionRelations;
