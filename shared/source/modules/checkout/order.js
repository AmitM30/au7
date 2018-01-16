
import { inject }               from 'aurelia-framework';
import { Router, Redirect }     from 'aurelia-router';

import { Review }               from '../../services/review';
import { Messenger }            from '../../services/messenger';
import { Common }               from '../../services/common';
import { Config }               from '../../services/config';
import { Cart }                 from '../../services/cart';
import { CartModel }            from '../../models/cart-model';
import { User }                 from '../../services/user';
import { Notifier }             from '../../services/notifier';

@inject(Review, Messenger, Common, Config, Cart, CartModel, User, Notifier, Router)
export class PlaceOrder {

  constructor (review, messenger, common, config, cart, cartModel, user, notifier, router) {
    this.review = review;
    this.messenger = messenger;
    this.common = common;
    this.config = config;
    this.cart = cart;
    this.cartModel = cartModel;
    this.user = user;
    this.notifier = notifier;
    this.router = router;
    this.moduleVersion = config.moduleVersion;
  }

  canActivate () {
    // if (this.cartModel.isValidAddress && this.user.info.isValidUser) {
    //   return true;
    // }

    return new Redirect('checkout');
  }

  activate (params, routeConfig) {
    this.viewName = routeConfig.name;
    this.needsPayment = true;
  }

  attached () { }

  updateItemQuantity (event) {
    this.review.updateItemQuantity(event.detail).then(() => { this.orderCheck(); });
  }

  remove (event) {
    this.detail = event.detail;
    this.review.remove(event.detail).then((cart) => { this.orderCheck(); });
  }

  orderCheck (paymentParams) {
    this.common.appLoading = true;
    this.review.getCartData(paymentParams).then((res) => {
      this.common.appLoading = false;

      if (res.error) {
        this.notifier.setMessage(window.translate.messaging(res.error));
        return this.cart.count().then((count) => {
          if (count > 0) { return this.orderCheck(); }
          this.router.navigateToRoute('cart');
        });
      }

      if (res.cartReview && res.cartReview.errors) {
        if (res.cartReview.errors.payment && res.cartReview.errors.payment.method === "INVALID") {
          this.cartModel.payment.method = this.config.defaultPaymentMethod;

          return this.orderCheck();
        }
      }

      if (res.oosItems) {
        this.oosItems = this.oosItems || [];
        this.oosItems = this.oosItems.concat(res.oosItems);
        this.orderCheck();
      }

      this.common.appLoading = false;
      this.messenger.messages = res.messages;
    });
  }

  checkCoupon (event) {
    let couponVal = event.target.querySelector('input[name=couponCode]').value;
    if (couponVal) {
      this.review.coupon({ couponCode: couponVal }).then((res) => {
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

  giftingOption (event) {
    return this.review.getCartData({ giftOption: event.detail.giftOption});
  }

  makeDefaultShipping () {
    this.common.appLoading = true;
    this.cartModel.addresses.shipping.default = true;

    this.user.createOrUpdateAddress(this.cartModel.addresses.shipping).then((response) => {
      this.common.appLoading = false;
    });
  }

  getViewStrategy () {
    return this.config.templateURL + 'modules/checkout/' + this.viewName + this.config.moduleVersion + '.html';
  }
}
