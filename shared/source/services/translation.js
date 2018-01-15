import { inject }               from 'aurelia-framework';

import { Config }               from './config';

import * as ar_translations     from 'json-loader!../../locales/ar/translation.json';
import * as en_translations     from 'json-loader!../../locales/en/translation.json';
import * as ar_error            from 'json-loader!../../locales/ar/error.json';
import * as en_error            from 'json-loader!../../locales/en/error.json';

/**
 * Translations class
 */
@inject(Config)
export class Translation {
  constructor (config) {
    this.translate = (config.locale.lang === 'en') ? en_translations : ar_translations;
    this.translateMessaging = (config.locale.lang === 'en') ? en_error : ar_error;

    this.init();

    // this.activate();
  }

  init () {
    let fn = function (key) {
      return this.translate[key] || key;
    };

    window.translate = fn.bind(this);

    let messaging = function (key) {
      return this.translateMessaging[key] || key;
    };

    window.translate.messaging = messaging.bind(this);
  }

  activate () {
    console.log('Activate: TRANSLATION');
  }
}
