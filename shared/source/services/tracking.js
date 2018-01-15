
import { inject }               from 'aurelia-framework';

import { Config }               from './config';
import { Common }               from './common';
import { Storage }              from './core/storage';
import { Utils }                from '../misc/utils';

let setCookie = function (key, value, path, domain, expiry) {
  window.document.cookie = key + '=' + value + '; path=' + path + '; domain=.' + domain + ';' +
                                  (expiry ? ' expires=' + expiry + ';' : '');
}

/**
 * Marketing Campaigns tracking class
 */
@inject(Config, Common, Storage)
export class Tracking {

  constructor (config, common, storage) {
    this.domain = config.domain;
    this.utmParams = config.tracking.utm;
    this.lasttouchParams = config.tracking.lasttouch;
    this.seoReferral = config.tracking.SEO;
    this.searchParams = Utils.getQueryParamsAsObject();

    this.storage = storage;
    this.common = common;

    // set device type
    setCookie('device', config.device, '/', this.domain);

    // this.activate();
  }

  init () {
    try {
    this.utmParams.map((key, index) => {

      let now = new Date();
      now.setDate(now.getDate() + 1);

      var lasttouchDate = new Date(new Date(new Date(now).setMonth(now.getMonth() + 1)).setDate(now.getDate()));
      let utm_value = null, lasttouch_value = null;

      // appName - doodle
      setCookie('appName', 'doodle', '/', this.domain, lasttouchDate.toUTCString());

      // Query String
      if (this.searchParams[key]) {
        utm_value = lasttouch_value = this.searchParams[key];
      } else if (document.referrer) {
        let referrerUrl = new URL(document.referrer);
        if (referrerUrl.hostname.indexOf(this.domain) < 0) {
          let found = this.seoReferral.find((d) => { return referrerUrl.hostname.indexOf(d.toLowerCase()) >= 0; });
          if (found) {
            utm_value = lasttouch_value = 'SEO';
          } else {
            utm_value = lasttouch_value = 'Referral';
          }
        }
      } else {
        utm_value = key === 'utm_source' ? 'DIRECT' : null;
      }

      if (utm_value && !this.common.device.isApp) {
        setCookie(key, utm_value, '/', this.domain, now.toUTCString());
      }
      if (lasttouch_value) {
        setCookie(this.lasttouchParams[index], lasttouch_value, '/', this.domain, lasttouchDate.toUTCString());
      }
    });
    } catch (e) {
      // this.request.error({ error: e });
      // this.ea.publish('Unhandled-Error', e);
    }
  }

  activate () {
    console.log('Activate: TRACKING');
  }
}

// utmSupport.referrerUrl = ($window.referrerData && $window.referrerData[0] && $window.referrerData[0].referrer && $window.referrerData[0].referrer!==null)
                            // ? $window.referrerData[0].referrer.toLowerCase() : null;
