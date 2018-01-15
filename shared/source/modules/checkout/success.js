
import { inject }               from 'aurelia-framework';
import { Router }               from 'aurelia-router';

import { User }                 from '../../services/user';
import { Review }               from '../../services/review';
import { Notifier }             from '../../services/notifier';
import { Config }               from '../../services/config';
import { AppWrapper }           from '../../services/app-wrapper';
import { Common }               from '../../services/common';
import { Cart }                 from '../../services/cart';
import { CartModel }            from '../../models/cart-model';
import { Utils }                from '../../misc/utils';

@inject(Router, User, Review, Notifier, AppWrapper, Common, Config, CartModel, Cart)
export class ThankYou {

  constructor (router, user, review, notifier, appWrapper, common, config, cartModel, cart) {
    this.router = router;
    this.user = user;
    this.review = review;
    this.notifier = notifier;
    this.appWrapper = appWrapper;
    this.common = common;
    this.config = config;
    this.cart = cart;

    this.cartModel = cartModel;
  }

  canActivate () {
    return this.review.getOrderFromStorage().then((res) => {
      return res ? true : false;
    });
  }

  activate (params, routeConfig) {
    this.viewName = routeConfig.name;
    this.token = params.token;
    this.cartModel.orderNumber = params.orderNumber;

    this.common.bodyClass = 'section-' + this.viewName;

    this.user.idCheck(this.token).then((res) => {
      if (res.success) {
        this.messaging = res.msg;
      }
    });

    this.uploadParams = { allowedFileTypes: this.config.validations.documentUpload.types, allowedSize: this.config.validations.documentUpload.size };
  }

  async attached () {
    let order = await this.review.getOrderFromStorage();
    let cart = await this.cart.log();

    window.dispatchEvent(new CustomEvent('checkout-purchase', { detail: { order: order, cart: cart } }));

    this.review.clearCookiesOnSuccess().then((res) => {
      this.cart.length().then((count) => { this.common.cartCount = count; });
    });
  }

  uploadDocument () {
    this.user.uploadIDDocument({ file: event.detail.file, token: this.token}).then((res) => {
      if (res.status) {
        this.messaging = res.msg;
        this.notifier.setMessage(window.translate.messaging(res.msg));
      }
    });
  }

  continueShopping () {
    this.appWrapper.debug('Continue Shopping -> ' + JSON.stringify(this.common.device));
    if (this.common.device.isApp) {
      this.appWrapper.sendAppMessage('exit', { redirect: '/' });
    } else {
      this.router.navigate('/');
    }
  }

  // TODO - THIS IS ONLY NEEDED WHILST DOODLE FLUID IS NOT ON PROD & PHOENIX IS
  forceToHome () {
    window.location.href = '/';
  }

  getViewStrategy () {
    return '/android_asset/www/modules/checkout/' + this.viewName + ((this.common.device.isFMCG) ? '.fmcg' : '') + this.config.moduleVersion + '.html';
  }
}
