
import { inject }               from 'aurelia-framework';
import { InlineViewStrategy }   from 'aurelia-framework';

import { Common }               from '../services/common';
import { Request }              from '../services/request';
import { Config }               from '../services/config';
import { Helpers }              from '../misc/helpers';

@inject(Common, Request, Config)
export class Search {

  constructor (common, request, config) {
    this.common = common;
    this.request = request;
    this.config = config;
  }

  activate (params, routeConfig) {
    this.viewName = routeConfig.name;
    this.common.pageType = 'Search';
  }

  attached () { }

  canDeactivate () { }

  getViewStrategy () {
    return this.config.templateURL + 'modules/' + this.viewName + this.config.moduleVersion + '.html';
  }

  determineActivationStrategy () {
    return activationStrategy.replace;
  }
}
