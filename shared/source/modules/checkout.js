
import { inject }               from 'aurelia-framework';
import { EventAggregator }      from 'aurelia-event-aggregator';

import { User }                 from '../services/user';
import { Config }               from '../services/config';
import { Common }               from '../services/common';
import { Review }               from '../services/review';
import { Cart as CartService }  from '../services/cart';
import { Messenger }            from '../services/messenger';
import { Notifier }             from '../services/notifier';
import { AppWrapper }           from '../services/app-wrapper';
import { CartModel }            from '../models/cart-model';
import { Utils }                from '../misc/utils';

@inject(Review, CartService, CartModel, Config, Common, User, EventAggregator, Messenger, Notifier, AppWrapper)
export class Checkout {

  constructor (review, cartService, cartModel, config, common, user, ea, messenger, notifier, appWrapper) {
    this.review = review;
    this.cart = cartService;
    this.cartModel = cartModel;
    this.common = common;
    this.config = config;
    this.user = user;
    this.ea = ea;
    this.messenger = messenger;
    this.notifier = notifier;
    this.appWrapper = appWrapper;

    this.moduleVersion = config.moduleVersion;
  }

  configureRouter (config, router) {
    config.map([
      { route: ['', 'checkout'],         redirect: 'sign-in' },
      { route: 'sign-in',                name: 'signin',   moduleId: './checkout/signin',      nav: true,   title: 'Sign In' },
      { route: 'shipping',               name: 'shipping', moduleId: './checkout/shipping',    nav: true,   title: 'Shipping' },
      // { route: 'order',                  name: 'order',    moduleId: './checkout/order',       nav: false,    title: 'Summary' },
      { route: 'payment',                name: 'payment',  moduleId: './checkout/payment',     nav: true,    title: 'Payment' },
      { route: 'success/:orderNumber',   name: 'success',  moduleId: './checkout/success',     nav: false,   title: 'Thank You' },
      { route: 'error/:orderNumber',     name: 'error',    moduleId: './checkout/error',       nav: false,   title: 'Error' }
    ]);
    config.mapUnknownRoutes('./checkout');

    this.router = router;
  }

  canActivate () {
    if (this.common.device.isApp) {
      return true;
    }

    return this.cart.count().then((len) => {
      this.appWrapper.debug('In Checkout: cart length -> ' + len);
      return len < 1 ? false : true;
    });
  }

  async activate (params, routeConfig) {
    this.common.appLoading = true;
    this.viewName = routeConfig.name;
    this.common.pageType = 'Checkout';

    Promise.all([ this.user.getAreas(), this.user.getCities() ]).then((res) => {
      this.common.appLoading = false;
      this.config.areasList = res[0].meta.content;
      this.setCities(res[1].meta.content);
    }).catch(() => { this.common.appLoading = false; });

    this.initRouteChangeListener();
    await this.orderCheck();
  }

  attached () {
    this.cart.log().then((cart) => {
      this.cartModel.items = cart.items;
      this.cartModel.vendors = cart.vendors; 
    });
  }

  initRouteChangeListener () {
    this.checkoutAnalytics = this.ea.subscribe('router:navigation:processing', (navigationInstruction) => {
      if (navigationInstruction.instruction.config.name === 'checkout') {
        let detail = {};
        switch (true) {
          case /shipping/.test(navigationInstruction.instruction.params.childRoute):
            detail = { step: 2, option: this.user.info.email };
            window.dispatchEvent(new CustomEvent('checkout-step', { detail: detail }));
            break;
          // case /order/.test(navigationInstruction.instruction.params.childRoute):
          //   detail = { step: 3 };
          //   break;
          case /payment/.test(navigationInstruction.instruction.params.childRoute):
            detail = { step: 3, option: { phoneVerification: this.user.info.isPhoneVerified } };
            window.dispatchEvent(new CustomEvent('checkout-step', { detail: detail }));
            break;
        }
      }
    });

    this.checkoutSuccessAnalytics = this.ea.subscribe('router:navigation:success', (navigationInstruction) => {
      if (navigationInstruction.instruction.config.name === 'checkout') {
        if (/success/.test(navigationInstruction.instruction.params.childRoute)) {
          let detail = {};
          detail = { step: 4, option: this.cartModel.payment.method };
          window.dispatchEvent(new CustomEvent('checkout-step', { detail: detail }));
        }
      }
    });

    // Something went wrong
    this.ea.subscribe('router:navigation:error', (e) => {
      // console.log('router:navigation:error');
    });
  }

  setCities (cities) {
    this.config.citiesList = Object.keys(cities).map((k) => {
      if (this.config.locale.lang == 'ar') {
        return { label: k, value: cities[k] };
      }

      return { label: cities[k], value: cities[k] };
    });
  }

  moveToSignin () {
    let email = this.user.info.email;
    this.user.logout().then((res) => {
      this.router.navigateToRoute('signin', { edit: true });
    });
  }

  moveToShipping () {
    this.router.navigateToRoute('shipping', { edit: true });
  }

  moveToPayment () {
    this.cartModel.email = this.user.info.email;

    if (this.common.device.isApp) {
      this.user.setAddressInStorage();
    }

    if (typeof this.cartModel.addresses.shipping !== 'undefined') {
      // Can move to payment
      this.router.navigateToRoute('payment');
    } else if (typeof this.user.info.defaultAddress !== 'undefined') {
      this.cartModel.addresses.shipping = this.user.info.defaultAddress;
      this.router.navigateToRoute('payment');
    }
  }

  moveToPayment () {
    this.router.navigateToRoute('payment', { edit: true });
  }

  updateItemQuantity (event) {
    this.review.updateItemQuantity(event.detail).then(() => { this.orderCheck(); });
  }

  remove (event) {
    this.detail = event.detail;
    this.review.remove(event.detail).then((cart) => { this.orderCheck(); });
  }

  orderCheck (paymentParams) {
    this.common.appLoading = true;
    return this.review.getCartData(paymentParams).then((res) => {
      this.common.appLoading = false;
      if (res.error) {
        this.notifier.setMessage(res.error);
        return this.cart.count().then((count) => {
          if (count > 0) { return this.orderCheck(); }
          this.router.navigateToRoute('cart');
        });
      }

      if (res.oosItems) {
        this.oosItems = this.oosItems || [];
        this.oosItems = this.oosItems.concat(results);
        this.orderCheck();
      }

      if (res.cartReview && res.cartReview.errors) {
        if (res.cartReview.errors.payment && res.cartReview.errors.payment.method === "INVALID") {
          this.cartModel.payment.method = this.config.defaultPaymentMethod;

          return this.orderCheck();
        }
      }

      this.messenger.messages = res.messages;
      if (res.messages[0]) {
        this.notifier.setMessage(window.translate(res.messages[0]));
      }
    });
  }

  checkCoupon (event) {
    this.common.appLoading = true;
    this.cartModel.coupon = event.detail.code;
    if (this.cartModel.coupon) {
      this.review.coupon().then((res) => {
        this.common.appLoading = false;
        if (res.error) {
          this.notifier.setMessage(window.translate.messaging(res.error));
        } else {
          this.notifier.setMessage(window.translate.messaging('couponSuccessful'));
          this.messenger.messages = res.messages;
        }
      });
    }
  }

  removeCoupon () {
    this.common.appLoading = true;
    this.cartModel.coupon = null;
    this.review.coupon().then((res) => {
      this.common.appLoading = false;
      if (res.error) {
        this.notifier.setMessage(window.translate.messaging(res.error));
      } else {
        this.notifier.setMessage(window.translate.messaging('couponRemovedSuccessful'));
        this.messenger.messages = res.messages;
      }
    });
  }

  updateSubscription (event) {
    this.cartModel.misc.newsletter = event.currentTarget.checked;
  }

  getViewStrategy () {
    return '/android_asset/www/modules/' + this.viewName + this.config.moduleVersion + '.html';
  }

  canDeactivate () {
    if(this.common.device.isApp) {
      this.appWrapper.sendAppMessage('exit', { redirect: '/' });
      return false;
    }

    // TODO: Remove when desktop large on live
    if (this.config.site === 'large') {
      window.location.href = '/';
      return false;
    }

    return true;
  }

  deactivate () {
    this.checkoutAnalytics.dispose();
    this.checkoutSuccessAnalytics.dispose();
    if (this.fixedCart) {
      window.removeEventListener(this.fixedCart);
    }
    if (this.resizeBody) {
      window.removeEventListener(this.resizeBody);
    }
  }
}
