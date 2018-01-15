
import { inject }               from 'aurelia-framework';
import { Router }               from 'aurelia-router';
import { InlineViewStrategy }   from 'aurelia-framework';

import { Common }               from '../services/common';
import { Request }              from '../services/request';
import { Config }               from '../services/config';
import { Helpers }              from '../misc/helpers';

@inject(Common, Request, Router, Config)
export class Home {

  constructor (common, request, router, config) {
    this.common = common;
    this.request = request;
    this.config = config;
    this.router = router;
  }

  activate (params, routeConfig) {
    this.viewName = routeConfig.name;
    this.common.pageType = 'Home';

    this.router.events.subscribe('router:navigation:complete', (navigationInstruction) => {
      if (navigationInstruction.instruction.config.name === 'home') {
        this.common.bodyClass = 'section-home';
      } else {
        this.common.bodyClass = this.common.bodyClass.replace(/(section-home)/, '');
      }
    });

    let fn = function () {
      this.customView = this.response.code !== 404 && this.response.render && this.response.render.templateId;
      this.common.setMeta(this.response.meta, routeConfig.navModel);
    };

    if (this.common.firstLoad && this.common.loadAPIData) {
      this.response = this.common.loadAPIData;
      fn.call(this);
    } else {
      return this.request.backend().then((response) => {
        this.response = response;
        fn.call(this);
      });
    }
  }

  attached () { }

  canDeactivate () { }

  getViewStrategy () {
    if (this.customView) {
      this.json = Helpers.initAsyncRender(this.response.render);
      this.common.bodyClass = (this.response.render.overridingCSS) ? this.response.render.overridingCSS : this.common.bodyClass;

      if (this.response.render.templateString) {
        return new InlineViewStrategy(this.response.render.templateString);
      }
    }

    return this.config.templateURL + 'modules/' + this.viewName + this.config.moduleVersion + '.html';
  }

  determineActivationStrategy () {
    return activationStrategy.replace;
  }
}
