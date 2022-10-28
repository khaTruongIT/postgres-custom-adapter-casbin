/* eslint-disable @typescript-eslint/no-explicit-any */
import {CasbinEvent} from './casbin-event';

export abstract class CasbinModelEvent<
  Entity = any,
  Input = any,
> extends CasbinEvent {
  public readonly entity: Entity;
  public readonly input?: Input;

  protected constructor(
    entity: Entity,
    name: string,
    id: string,
    type: 'created' | 'updated' | 'deleted',
    input?: Input,
  ) {
    super(name, type, id);
    this.entity = entity;
    this.input = input;
  }
}
