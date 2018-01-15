
import { inject }               from 'aurelia-framework';

import { Config }               from './config';
import { Queue }                from './core/queue';
import { Analytics }            from './analytics';

/**
 * Event Listener class
 */
@inject(Config, Analytics)
export class Listener {

  constructor (config, analytics) {
    this.events = config.events;
    this.analytics = analytics;

    /**
     * The event queue is processed at specific instances:
     * 1. After event 'x' number of events -> 'x' comes from config (maxEventThresholdCount)
     * 2. After every 'n' number of seconds -> 'n' comes from config (maxEventThresholdTime)
     * 3. On every view unload
     *
     * Best to instantiate a new object for Queue class as
     * Aurelia creates singleton instances for all injected ones
     */
    this.queue = new Queue();

    this.init();
  }

  init () {
    // console.log('Activate: LISTENER');

    // Deferred Events
    for (let name of Object.keys(this.events.handlers)) {
      let capture = function (event) {
        this.queue.enqueue({ 'type': event.type, 'data': event.detail, 'object': this.events.handlers[name] });

        // Analytics watcher for event threshold max count
        if (this.queue.count >= this.events.maxEventThresholdCount) {
          this.processQueue();
        }
      };

      window.addEventListener(name, capture.bind(this));
    }

    // Immediate Events
    for (let name of Object.keys(this.events.immediate)) {
      let capture = function (event) {
        this.processQueue();
        this.analytics.fireEvents([{ 'type': event.type, 'data': event.detail, 'object': this.events.immediate[name] }], true);
      };

      window.addEventListener(name, capture.bind(this));
    }

    // Analytics watcher for event threshold max timeout
    let fn = function () {
      this.processQueue();
    };
    window.setInterval(fn.bind(this), this.events.maxEventThresholdTime * 1000);

    // Analytics watcher for page unload event
    window.addEventListener('beforeunload', fn.bind(this));

    // Swiper slide events
    window.addEventListener('swiper-swiped', (data) => {
      this.analytics.fireEvents([{ 'type': 'swiperswiped', 'data': data, 'object': this.events.immediate[name] }], true);      
    });
  }

  /**
   * Method to process Analytics queue
   * Uses 'Analytics' service
   *
   * @returns {undefined} nothing
   */
  processQueue () {
    let items = this.queue.dequeueXItems(this.events.maxEventThresholdCount);
    if (items) {
      this.analytics.fireEvents(items);
    }
  }
}
