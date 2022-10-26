/* eslint-disable @typescript-eslint/no-explicit-any */
import {Entity, property, model} from '@loopback/repository';
import {TimestampMixin} from '../mixins';

@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'team',
    },
  },
})
export class Team extends TimestampMixin(Entity) {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'array',
    itemType: 'number',
  })
  teamMemberIds?: number[];

  @property({
    type: 'number',
    required: true,
  })
  ownerId: number;

  [prop: string]: any;

  constructor(data?: Partial<Team>) {
    super(data);
  }
}

export interface TeamRelations {}

export type TeamWithRelations = Team & TeamRelations;
