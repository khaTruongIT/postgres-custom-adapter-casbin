/* eslint-disable @typescript-eslint/no-explicit-any */
import {CasbinModelEvent} from './casbin-model-event';
// import {injectable, BindingScope} from '@loopback/core';

export interface ICasbinEventBus {
  enqueue(event: CasbinModelEvent): void;
  dequeue(): void;
}

export class CasbinEventBus implements ICasbinEventBus {
  public tail: number;
  public head: number;
  public events: CasbinModelEvent[];

  constructor() {
    this.tail = 0;
    this.head = 0;
    this.events = [];
  }

  enqueue(event: CasbinModelEvent<any, any>) {
    this.events[this.tail] = event;
    this.tail++;
  }

  // delete events
  dequeue() {
    const item = this.events[this.head];
    delete this.events[this.head];
    this.head++;
    return item;
  }

  // get event of the queue
  peek() {
    return this.events[this.head];
  }

  // get length
  get length() {
    return this.tail - this.head;
  }

  // check length of the queue
  get isEmpty() {
    return this.length === 0;
  }
}
