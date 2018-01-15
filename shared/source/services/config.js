
import { Utils }                from '../../../shared/source/misc/utils';

import * as app_settings        from 'json-loader!../../../src/config_default.json';

export class Config {

  constructor () {
    Object.assign(this, app_settings);
    this.init();
  }

  init () {
    // console.log('Activate: CONFIG SERVICE');
    let subdomain = (window.location.hostname.split('.')[0]);
    let locale = window.location.hostname.split('.')[0].split('-');

    this.domain = 'wadi.com';
    this.api = 'api.wadi.com';
    this.xdomain = this.api + '/data/xdomain.html';
    this.locale.lang = 'en';
    this.locale.country = 'sa';
    this.localeCookie = 'en_SA';
    this.locale.currency = this.currencyMapping[this.locale.country + '-' + this.locale.lang];
    this.locale.setting.cs = this.customerSupport[this.locale.country];
    this.device = window.config.device;
    this.areasList = [];
    this.citiesList = [];
    this.apis.trackOrder = '//track.' + this.domain + '/token/';
    this.iosUserAgentString = new RegExp('iP(hone|od|ad)', 'g');
    this.isIOSUserAgent = (
      window.navigator
      && window.navigator.userAgent
      && (window.navigator.userAgent.match(this.iosUserAgentString) !== null)
    ) ? true : false;
  }
}
