/**
 * xdLocalStorage -> Source From: https://github.com/ofirdagan/cross-domain-local-storage
 */

import { inject }               from 'aurelia-framework';
import { EventAggregator }      from 'aurelia-event-aggregator';

import { Config }               from '../config';
import * as xd                  from '../../lib/xdLocalStorage';

@inject(EventAggregator, Config)
export class XDomain {

  constructor (ea, config) {
    xdLocalStorage.init({
      /* required */
      iframeUrl: 'https://' + config.xdomain,
      //an option function to be called right after the iframe was loaded and ready for action
      initCallback: () => { ea.publish('cart-ready'); }
    });

    // this.activate();
  }

  activate () {
    console.log('Activate: XDOMAIN');
  }
}
