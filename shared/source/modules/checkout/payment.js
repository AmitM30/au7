
import { inject, computedFrom } from 'aurelia-framework';
import { Router, Redirect }     from 'aurelia-router';

import { Review }               from '../../services/review';
import { Notifier }             from '../../services/notifier';
import { Messenger }            from '../../services/messenger';
import { User }                 from '../../services/user';
import { Config }               from '../../services/config';
import { Common }               from '../../services/common';
import { Cart as CartService }  from '../../services/cart';
import { AppWrapper }           from '../../services/app-wrapper';
import { CartModel }            from '../../models/cart-model';
import { Utils }                from '../../misc/utils';

@inject(Router, Review, Notifier, Messenger, Common, Config, CartModel, User, CartService, AppWrapper)
export class Payment {

  constructor (router, review, notifier, messenger, common, config, cartModel, user, cartService, appWrapper) {
    this.router = router;
    this.moduleVersion = config.moduleVersion;
    this.review = review;
    this.messenger = messenger;
    this.notifier = notifier;
    this.common = common;
    this.cartModel = cartModel;
    this.user = user;
    this.config = config;
    this.cart = cartService;
    this.appWrapper = appWrapper;

    this.phoneConfig = config.countries[config.locale.country].phone;
    this.hideSummary = true;
    this.hideDiscountInfo = true;
  }

  canActivate () {
    if (this.cartModel.isValidAddress && this.user.info.isValidUser) {
      return true;
    }

    return new Redirect('checkout');
  }

  async activate (params, routeConfig) {
    this.viewName = routeConfig.name;

    this.NO_PAYMENT = this.config.token.no_payment;
    // this.needsPayment = true;
    this.canPlaceOrder = false;
    this.cartModel.payment.card = this.cartModel.getDefaultCCObject();
    this.cartModel.payment.token =  this.cartModel.getDefaultTokenizationObject();
    this.previousSelectodMethod = this.cartModel.payment.method;
          
    if (!this.cartModel.addresses.billing) {
      this.cartModel.addresses.billing = this.cartModel.getDefaultAddressObject();
    }
    
    this.savedCards = await this.user.getSavedCard(this.user.info.email)
      .then((res) => {
        return res.data;
      })
      .catch((res) => {
        return [];
      });

    if (this.cartModel.details && this.cartModel.details.wallet && this.cartModel.details.wallet.amount) {
      this.cartModel.use_wallet = true;
    }
    return this.orderCheck();
  }

  attached () { }

  showSummary () {
    this.hideSummary = !this.hideSummary;
  }

  showInfo () {
    this.hideDiscountInfo = !this.hideDiscountInfo;
  }

  @computedFrom('cartModel.payment.method')
  get selectedMethod() {
    this.cartModel.payment.card = this.cartModel.getDefaultCCObject();
    this.cartModel.payment.token =  this.cartModel.getDefaultTokenizationObject();
    return this.cartModel.payment.method;
  }

  @computedFrom('cartModel.details')
  get needsPayment() {
    if (this.cartModel.details && this.cartModel.details.invoice && this.cartModel.details.invoice[7].value === "0") {      
      return false;
    }

    return true;
  }

  useWallet() {
    if (this.cartModel.use_wallet) {
      this.cartModel.payment.method = this.previousSelectodMethod;
    }

    return this.orderCheck();
  }

  orderCheck (paymentParams) {
    this.review.postCartData(paymentParams).then((res) => {
      this.common.appLoading = false;
      this.appWrapper.debug('Review: Response -> ' + JSON.stringify(res));

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
      
      if (!this.needsPayment && this.cartModel.payment.method !== this.NO_PAYMENT) {
        this.cartModel.payment.method = this.NO_PAYMENT;
        this.orderCheck();
      }

      this.messenger.messages = res.messages;
      if (res.messages[0]) {
        this.notifier.setMessage(window.translate(res.messages[0]));
      }
    });
  }

  remove (event) {
    this.common.appLoading = true;
    this.review.remove(event.detail).then((cart) => {
      this.cart.count().then((count) => {
        this.orderCheck();
      });
    });
  }

  selectPaymentMethod (selectedMethod) {
    this.cartModel.payment.method = selectedMethod;
    if (selectedMethod !== this.NO_PAYMENT) {
      this.previousSelectodMethod = selectedMethod;
    }

    return this.orderCheck();
  }

  order () {
    // this.appWrapper.debug('Order -> ' + JSON.stringify(this.cartModel));
    this.common.appLoading = true;
    this.review.order().then((response) => {
      this.appWrapper.debug('Order Review Response -> ' + JSON.stringify(response));
      this.common.appLoading = false;
      this.appWrapper.debug('Order Review Response -> ' + JSON.stringify(response));
      if (response.order_nr) {
        this.router.navigateToRoute('success', { orderNumber: response.order_nr, token: response.t });
      } else if (response.redirect) {
        return;
      } else {
        this.notifier.setMessage(window.translate.messaging('an error has occured'));
      }
    });
  }

  postOrderReview () {
    this.orderCheck();
  }

  saveBillingAddress (event) {
    this.cartModel.addresses.billing = event.detail.newAddress;
    this.user.setAddressInStorage();
  }

  // TODO - Should not be a part of the payment class
  submitPaymentCCForm (formData) {
    let form = document.createElement('form');

    form.method = 'POST';
    form.action = formData.redirect_url;

    for (let prop in formData) {
      let element = document.createElement('input');
      element.value = formData[prop];
      element.name = prop;
      element.type = 'hidden';
      form.appendChild(element);
    }

    document.body.appendChild(form);
    form.submit();
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

  updateItemQuantity (event) {
    this.common.appLoading = true;
    this.review.updateItemQuantity(event.detail).then(() => { this.orderCheck(); });
  }

  makeDefaultShipping () {
    this.common.appLoading = true;
    this.cartModel.addresses.shipping.default = true;

    this.user.createOrUpdateAddress(this.cartModel.addresses.shipping).then((response) => {
      this.common.appLoading = false;
    });
  }

  deleteSavedCard(event) {
    this.user.deleteCard(event.detail.id);
  }

  // moveToSummary () {
  //   this.router.navigateToRoute('order', { edit: true });
  // }

  getViewStrategy () {
    return '/android_asset/www/modules/checkout/' + this.viewName + this.config.moduleVersion + '.html';
  }
}
