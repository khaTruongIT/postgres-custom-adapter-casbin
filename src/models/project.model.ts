import {Entity, model, property, belongsTo} from '@loopback/repository';
import {TimestampMixin} from '../mixins';
import {User} from './user.model';

@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'project',
    },
  },
})
export class Project extends TimestampMixin(Entity) {
  @property({
    type: 'number',
    id: true,
    generated: true,
    index: true,
  })
  id: number;

  @property({
    type: 'string',
    description: 'name of project',
  })
  name: string;

  @property({
    type: 'number',
    description: 'balance of project',
  })
  balance: number;

  /**
   * description: owner of project
   */
  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {}

export type ProjectWithRelations = Project & ProjectRelations;
