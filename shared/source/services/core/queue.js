
/**
 * Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 *
 * Source From: http://code.stephenmorley.org/javascript/queues/#download
 */

/**************************************************************************/
/* IMPORTANT: Best to instantiate a new object for Queue class when using */
/* as Aurelia creates singleton instances for all classes                 */
/**************************************************************************/
export class Queue {

  constructor (config) {
    this.queue  = [];
    this.offset = 0;
  }

  /* Enqueues the specified item. The parameter is:
   *
   * item - the item to enqueue
   */
  enqueue (item) {
    this.queue.push(item);
  }

  /* Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  dequeue () {
    if (this.queue.length === 0) {
      return undefined;
    }

    let item = this.queue[this.offset];

    if (++ this.offset * 2 >= this.queue.length) {
      this.queue  = this.queue.slice(this.offset);
      this.offset = 0;
    }

    return item;
  }

  /* Dequeues 'X' items and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  dequeueXItems (x) {
    if (this.queue.length === 0) {
      return undefined;
    }

    let items = [];
    for (let i = this.offset; i < (this.offset + x); i++) {
      if (this.queue[this.offset]) {
        items.push(this.queue[this.offset]);
      }

      if (++ this.offset * 2 >= this.queue.length) {
        this.queue  = this.queue.slice(this.offset);
        this.offset = 0;
      }
    }

    return items;
  }

  /* Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   */
  peek () {
    return (this.queue.length > 0 ? this.queue[this.offset] : undefined);
  }

  get count () {
    return (this.queue.length - this.offset);
  }

  get isEmpty () {
    return this.queue.length === 0;
  }
}
