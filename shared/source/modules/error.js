
import { inject }               from 'aurelia-framework';

import { Config }               from '../services/config';
import { Request }              from '../services/request';

@inject(Config, Request)
export class NotFound {

  constructor (config, request) {
    this.moduleVersion = config.moduleVersion;
    this.request = request;
  }

  navigatingError (err) {
    try {
      this.request.error({
        path: err.instruction.previousInstruction.fragment + ' -> ' + err.instruction.fragment,
        params: err.instruction.params,
        error: {
          message: err.result.output.message,
          stack: err.result.output.stack
        }
      });
    } catch (e) {
      this.request.error(e);
    }
  }

  refError (referrer) {
    try {
      this.request.error({
        error: {
          referrer: referrer.domain,
          href: {
            host: referrer.url.host,
            pathname: referrer.url.pathname,
            search: referrer.url.search
          }
        }
      });
    } catch (e) {
      this.request.error(e);
    }
  }

  activate (params, routeConfig, navigationInstruction) {
    this.viewName = routeConfig.name;

    if (routeConfig.error) {
      this.navigatingError(routeConfig.error);
    }

    if (routeConfig.referrer) {
      this.refError(routeConfig.referrer);
    }
  }

  getViewStrategy () {
    return this.config.templateURL + '/modules/' + this.viewName + this.config.moduleVersion + '.html';
  }
}
