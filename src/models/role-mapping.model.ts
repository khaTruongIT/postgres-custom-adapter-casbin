import {Entity, model, property} from '@loopback/repository';
import {TimestampMixin} from '../mixins';

@model({
  settings: {},
})
export class RoleMapping extends TimestampMixin(Entity) {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'number',
  })
  userId: number;

  @property({
    type: 'number',
  })
  roleId: number;

  constructor(data?: Partial<RoleMapping>) {
    super(data);
  }
}

export interface RoleMappingRelations {
  // describe navigational properties here
}

export type RoleMappingWithRelations = RoleMapping & RoleMappingRelations;
