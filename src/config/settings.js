
import { inject }               from 'aurelia-framework';

import { Config }               from '../../shared/source/services/config';

import * as app_config          from 'json-loader!./config.json';
import * as footer              from 'json-loader!../jsons/footer.json';
import * as usps                from 'json-loader!../jsons/usps.json';

@inject(Config)
export class Settings {

  constructor (config) {
    config.footer = footer;
    config.usps = usps;

    this.init(config);

    this.set = (field, value) => {
      config[field] = value;
      this[field] = value;
    }
  }

  init (config) {
    config.site = app_config.site;
    config.direction = (config.locale.lang === 'ar') ? 'rtl' : 'ltr';
    config.switch.lang = config.locale.lang === 'en' ? 'ar' : 'en';
    config.switch.country = config.locale.country === 'ae' ? 'sa' : 'ae';
    config.myAccount = 'my.' + config.domain;
    config.createAccount = 'my.' + config.domain + '/register';
    config.templateURL = config.templateURL || window.appDirectory;

    window.document.body.style.direction = config.direction;

    Object.assign(this, app_config);
    Object.assign(this, config);
  }
}
