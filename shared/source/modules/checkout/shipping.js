
import { inject }               from 'aurelia-framework';
import { Router, Redirect }     from 'aurelia-router';

import { Review }               from '../../services/review';
import { Common }               from '../../services/common';
import { User }                 from '../../services/user';
import { Config }               from '../../services/config';
import { AppWrapper }           from '../../services/app-wrapper';
import { CartModel }            from '../../models/cart-model';
import { Utils }                from '../../misc/utils';

@inject(Router, Review, Common, User, AppWrapper, CartModel, Config)
export class Shipping {

  constructor (router, review, common, user, appWrapper, cartModel, config) {

    this.router = router;
    this.common = common;
    this.review = review;
    this.user = user;
    this.appWrapper = appWrapper;
    this.cartModel = cartModel;
    this.moduleVersion = config.moduleVersion;
    this.config = config;
    this.phoneConfig = config.countries[config.locale.country].phone;
  }

  async canActivate (params) {
    if (!this.user.info.isValidUser && !this.common.device.isApp) {
      return new Redirect('/checkout');
    }

    let userAddress = await this.getUserAddresses();
    if (userAddress && userAddress.data) {
      this.user.info.setAddresses(userAddress.data, this.config.locale.country);

      if (!this.user.info.hasDefaultAddress && !this.cartModel.isValidAddress) {
        this.cartModel.addresses.shipping = this.user.info.otherAddresses[0];
      }
    }

    if (typeof params.edit === 'undefined') {
      if (this.user.info.hasDefaultAddress) {
        this.cartModel.addresses.shipping = this.user.info.defaultAddress;
        return new Redirect('/checkout/payment');
      }
    }

    return true;
  }

  activate (params, routeConfig) {
    this.viewName = routeConfig.name;
    this.cartModel.addresses.shipping = this.cartModel.addresses.shipping || this.cartModel.getDefaultAddressObject();
    this.cartModel.addresses.billing = this.cartModel.addresses.billing || this.cartModel.getDefaultAddressObject();

    this.canContinue = false;
  }

  attached () {
    this.appWrapper.debug('In Shipping: User -> ' + JSON.stringify(this.user.info));
    this.appWrapper.debug('In Shipping: Utils.cookieToJson() -> ' + JSON.stringify(Utils.cookieToJson()));
  }

  getUserAddresses () {
    if (this.user.info.isLoggedIn) {
      return this.user.addresses();
    } else if (this.common.device.isApp) {
      return this.user.getAddressFromStorage();
    }
  }

  moveToSignin () {
    let email = this.user.info.email;
    this.user.logout().then((res) => {
      this.router.navigateToRoute('signin', { edit: true });
    });
  }

  moveToSummary () {
    this.cartModel.email = this.user.info.email;

    if (this.common.device.isApp) {
      this.user.setAddressInStorage();
    }

    // if (typeof this.cartModel.addresses.shipping !== 'undefined') {
    if (this.cartModel.isValidAddress) {
      if (this.cartModel.addresses.shipping.isNew && this.user.info.isLoggedIn) {
        return this.user.createOrUpdateAddress(this.cartModel.addresses.shipping).then((response) => {
          if (response.idCustomerAddress) {
            this.cartModel.addresses.shipping.idCustomerAddress = response.idCustomerAddress;
            this.router.navigateToRoute('payment');
          }
        });
      }
      this.router.navigateToRoute('payment');
    } else if (typeof this.user.info.defaultAddress !== 'undefined') {
      this.cartModel.addresses.shipping = this.user.info.defaultAddress;
      this.router.navigateToRoute('payment');
    }
  }

  giftingOption (event) {
    return this.review.getCartData({ giftOption: event.detail.giftOption});
  }

  otpRequest (event) {
    this.appWrapper.debug('OTP Request -> ' + JSON.stringify(event.detail));
    this.event = event.target;
    this.user.sendOTP(event.detail).then((response) =>{
      if (!response.success) {
        this.event.set('otpError', false);
      }
      else if (response.phoneVerified) {
        this.event.set('otpVerified', true);
        this.user.info.skipPhoneVerification = false;
        this.user.info.primaryPhone = this.event.phoneNumber;
      }
    });
  }

  otpVerify (event) {
    this.appWrapper.debug('OTP Verify -> ' + JSON.stringify(event.detail));
    this.event = event.target;
    this.user.verifyOTP(event.detail).then((response) =>{
      if (!response.success) {
        this.event.set('otpError', true);
      }
      else if (response.phoneVerified) {
        this.event.set('otpVerified', true);
        this.user.info.skipPhoneVerification = false;
        this.user.info.primaryPhone = this.event.phoneNumber;
      }
    });
  }

  getViewStrategy () {
    return '/android_asset/www/modules/checkout/' + this.viewName + this.config.moduleVersion + '.html';
  }
}
