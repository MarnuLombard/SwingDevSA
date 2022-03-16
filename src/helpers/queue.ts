import {retry} from './rety';

class Node<T> {
  public next?: Node<T>;
  constructor(public value: T) {}
}

class LinkedList<T> {
  private head?: Node<T>;
  private tail?: Node<T>;

  public enqueue(item: T): void {
    const node = new Node<T>(item);

    if (this.head === undefined) {
      this.head = node;
    }
    if (this.tail instanceof Node) {
      this.tail.next = node;
    }

    this.tail = node;
  }

  public dequeue(): T|undefined {
    if (!(this.head instanceof Node)) {
      return;
    }
    const value = this.head.value;

    this.head = this.head.next;
    if (this.head === undefined) {
      this.tail = undefined;
    }

    return value;
  }
}

interface QueueInterface {
  // tslint:disable-next-line:no-any
  push(...functions: any[]): void
  run(): void
}

export class Queue implements QueueInterface {
  private list: LinkedList<Function>;

  constructor() {
    this.list = new LinkedList();
  }

  public push(...functions: (() => void)[]): void {
    functions.reverse().map(f => this.list.enqueue(f));
  }

  public run() {
    let current = this.list.dequeue();

    while (current) {
      current();
      current = this.list.dequeue();
    }
  }
}

export class RetryingQueue implements QueueInterface {
  // tslint:disable-next-line:no-any
  private list: LinkedList<[() => any, number]>;

  constructor() {
    this.list = new LinkedList();
  }

  public push(...functions: ([() => void, number])[]): void {
    functions.map(item => this.list.enqueue(item));
  }

  public async run() {
    let current = this.list.dequeue();

    while (current) {
      const [func, tries] = current;
      current = this.list.dequeue();

      await retry(func, tries, Array.isArray(current) ? current[0] : () => undefined);
    }
  }

  public async runUntil<T>(): Promise<T|undefined> {
    let current = this.list.dequeue();

    while (current) {
      const [func, tries] = current;
      try {
        const value: T | undefined = await retry<T>(func, tries);
        if (value) {
          return value;
        }
      } catch {
        // keep looping
      }

      current = this.list.dequeue();
    }

    return;
  }
}
