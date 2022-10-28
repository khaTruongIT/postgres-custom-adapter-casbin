/**
 * @description
 * The base class for all event simpleview event
 */

export class CasbinEvent {
  public readonly createdAt: Date;
  public readonly type: 'created' | 'updated' | 'deleted';
  public readonly name: string;
  public readonly id: string;

  protected constructor(
    name: string,
    type: 'created' | 'updated' | 'deleted',
    id: string,
  ) {
    this.type = type;
    this.name = name;
    this.id = id;
    this.createdAt = new Date();
  }
}
