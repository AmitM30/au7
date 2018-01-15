
import { inject }               from 'aurelia-framework';
import { EventAggregator }      from 'aurelia-event-aggregator';

import { SEO }                  from './seo';
import { Config }               from './config';
import { Helpers }              from '../misc/helpers';
import { Utils }                from '../misc/utils';

@inject(EventAggregator, Config, SEO)
export class Common {

  constructor (ea, config, seo) {
    this.config = config;
    this.seo = seo;

    // Application variables
    this.bodyClass = '';
    this.appLoading = false;
    this.ctx = {
      country: this.config.locale.country,
      lang: this.config.locale.lang,
      currency: this.config.locale.currency,
      device: window.config.device,
      cdn: this.config.CDNUrl,
      social: this.config.apis.keys.social,
      domain: this.config.domain
    };
    this.cartCount = 0;
    this.newsletterCustomer = { email: '', gender: 'female' };
    this.pageType = 'static';
    this.state = 'app';
    this.cartReady = false;
    this.firstLoad = true;

    // App [iOS / Android] specific settings
    this.device = {
      isApp: false,
      platform: null,
      udid: null,
      version: null,
      deviceId: null,
      debug: false
    };

    let json = window.wadiPageData || "{}";
    json = decodeURIComponent(json);
    this.loadAPIData = JSON.parse(json);
    if (Object.keys(this.loadAPIData).length < 1) {
      this.loadAPIData = null;
    }

    // this.init();
  }

  setMeta (obj, navModel, pageType, productName) {
    return this.seo.setMeta(obj, navModel, pageType, productName);
  }

  setLocaleCookie () {
    let now = new Date();
    now.setFullYear(now.getFullYear() + 1);
    window.document.cookie = 'locale-v1=' + this.config.localeCookie + '; path=/; domain=.' + this.config.domain + '; expires=' + now.toUTCString() + ';';
  }

  changeLanguage () {
    window.location.href = Helpers.switch(this.config.switch.lang, this.config.locale.country) + window.location.pathname + window.location.search;
  }

  changeCountry () {
    window.location.href = Helpers.switch(this.config.locale.lang, this.config.switch.country);
  }

  smoothScrollTo(element, offSetDifference) {
    offSetDifference = offSetDifference || 50;

    if (typeof element === 'string' && document.querySelector(element)) {
      let top = Utils.getOffset(document.querySelector(element)).top - offSetDifference;
      window.scroll({ top: top, left: 0, behavior: 'smooth' });
    } else {
      let top = Utils.getOffset(element).top - offSetDifference;
      window.scroll({ top: top, left: 0, behavior: 'smooth' });
    }
  }

  init () {
    console.log('Activate: COMMON');
  }
}
