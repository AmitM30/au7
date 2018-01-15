
import { inject }               from 'aurelia-framework';
import { EventAggregator }      from 'aurelia-event-aggregator';

import { Config }               from './config';
import { Request }              from './request';
import { Common }               from './common';
import { ProductListingModel }  from '../models/product-listing';
import { TsaheyluModel }        from '../models/crosstalk';

@inject(Config, Request, ProductListingModel, TsaheyluModel, EventAggregator, Common)
export class Tsaheylu {

  constructor (config, request, plpModel, tsaheyluModel, ea, common) {
    this.config = config;
    this.request = request;
    this.plpModel = plpModel;
    this.tsaheyluModel = tsaheyluModel;
    this.ea = ea;
    this.common = common;
  }

  /**
   * GETs the data for specified URL and binds it to Listing Model
   *
   * @param {Object} [event] source element with url
   */
  loadBindListingsProducts (event) {
    let fn = function (event) {
      return this.request.backend(event.detail.url).then((response) => {
        this.plpModel.response = response;
        return new Promise((resolve) => resolve());
      });
    };

    fn.call(this, event).then((res) => {
      var _self = this;
      window.setTimeout(function () { _self.ea.publish('lazy-load-images'); }, 100);
    });
  }

  /**
   * GETs the data for specified URL and binds it to Tsaheylu model
   * which is a crosstalk service for the application
   *
   * @param {Object} [event] source element with url
   */
  loadPageView (event) {
    let fn = function (event) {
      return this.request.backend(event.detail.url).then((response) => {
        this.tsaheyluModel.model = response;

        return new Promise((resolve) => resolve());
      });
    };

    this.common.appLoading = true;
    fn.call(this, event).then((res) => {
      this.common.appLoading = false;
      window.setTimeout(() => { this.ea.publish('lazy-load-images'); }, 100);
    });
  }
}
