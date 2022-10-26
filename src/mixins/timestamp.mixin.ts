import {MixinTarget} from '@loopback/core';
import {Entity, property} from '@loopback/repository';

export const TimestampMixin = <E extends MixinTarget<Entity>>(
  superClass: E,
) => {
  class Mixed extends superClass {
    @property({
      type: 'date',
      defaultFn: 'now',
      postgresql: {
        dataType: 'TIMESTAMP WITH TIME ZONE',
        columnName: 'createdat',
      },
    })
    createdAt: Date;

    @property({
      type: 'date',
      defaultFn: 'now',
      postgresql: {
        dataType: 'TIMESTAMP WITH TIME ZONE',
        columnName: 'updatedat',
      },
    })
    updatedAt: Date;
  }

  return Mixed;
};
