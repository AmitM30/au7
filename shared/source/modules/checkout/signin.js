
import { inject }               from 'aurelia-framework';
import { Router, Redirect }     from 'aurelia-router';

import { User }                 from '../../services/user';
import { Common }               from '../../services/common';
import { Notifier }             from '../../services/notifier';
import { Config }               from '../../services/config';

@inject(Router, User, Common, Notifier, Config)
export class Signin {

  constructor (router, user, common, notifier, config,) {
    this.router = router;
    this.user = user;
    this.common = common;
    this.config = config;
    this.notifier = notifier;
    this.moduleVersion = config.moduleVersion;
    this.phoneConfig = config.countries[config.locale.country].phone;

  }

  canActivate (params) {
    if (this.common.device.isApp) {
      return new Redirect('checkout/shipping?edit');
    }

    if (typeof params.edit === 'undefined') {
      if (this.user.info.isValidUser) {
        return new Redirect('checkout/shipping');
      }
    }

    return true;
  }

  activate (params, routeConfig) {
    this.viewName = routeConfig.name;
  }

  attached () { }

  loginUser (event) {
    this.user.login({ username: event.detail.email, password: event.detail.password })
      .then((response) => {
        if (response.isLoggedIn) {
          this.router.navigateToRoute('shipping');
        } else {
          this.notifier.setMessage(window.translate.messaging(response.message));
        }
      });
  }

  logoutUser () {
    this.user.logout();
  }

  socialLogin (event) {
    event.stopPropagation();
    this.user.socialLogin({ provider: event.detail.provider, token: event.detail.token }).then((response) => {
      if (this.user.info.isValidUser) {
        this.router.navigateToRoute('shipping');
      }
    });
  }

  guestLogin (event) {
    event.stopPropagation();
    this.user.guestLogin(event.detail);
    this.router.navigateToRoute('shipping');
  }

  forgotPass (event) {
    event.stopPropagation();
    this.user.passwordResetRequest({ email: event.detail.email})
      .then((response) => {
        this.notifier.setMessage(window.translate.messaging(response.message));
      });
  }

  otpRequest (event) {
    this.event = event.target;
    this.user.sendOTP(event.detail).then((response) => {
      if (!response.success) {
        this.event.set('otpError', false);
      }
      else if (response.phoneVerified) {
        this.event.set('otpVerified', true);
        this.user.info.primaryPhone = this.event.phoneNumber;
        this.user.info.skipPhoneVerification = false;
        this.user.savePrimaryPhone({number: this.event.phoneNumber, isPrimary: true, verified: true});
        this.router.navigateToRoute('shipping');
      }
    });
  }

  otpVerify (event) {
    this.event = event.target;
    this.user.verifyOTP(event.detail).then((response) =>{
      if (!response.success) {
        this.event.set('otpError', true);
      }
      else if (response.phoneVerified) {
        this.event.set('otpVerified', true);
        this.user.info.primaryPhone = this.event.phoneNumber;
        this.user.info.skipPhoneVerification = false;
        this.user.savePrimaryPhone({number: this.event.phoneNumber, isPrimary: true, verified: true});
        this.router.navigateToRoute('shipping');
      }
    });
  }

  skipPhoneVerification (event) {
    this.user.info.primaryPhone = event.detail.phone;
    this.user.info.skipPhoneVerification = true;
    this.router.navigateToRoute('shipping');
  }

  checkUserExistence (event) {
    event.stopPropagation();
    return this.user.checkUserExistence(event.detail.email).then((res) => {
      if (res.success) {
        event.target.isNewCustomer = false;
      } else {
        return this.user.createNewUser(event.detail.email).then((res) => {
          this.router.navigateToRoute('shipping');
        });
        // event.target.isNewCustomer = true;
      }

      this.user.guestLogin(event.detail);
      event.target.proceedingWithEmail = true;
    });
  }

  passwordResetRequest (event) {
    event.stopPropagation();
    this.user.passwordResetRequestV2(event.detail)
      .then((response) => {
        if (response.success) {
          event.target.passResetRequestSent = true;
          this.notifier.setMessage(window.translate.messaging(response.message));
        }
      });
  }

  setPassword (event) {
    event.stopPropagation();
    this.user.passwordResetV2(event.detail).then((response) => {
        if (response.isLoggedIn) {
          this.router.navigateToRoute('shipping');
        } else {
          this.notifier.setMessage(window.translate.messaging(response.message));
        }
      });
  }

  getViewStrategy () {
    return this.config.templateURL + '/modules/checkout/' + this.viewName + this.config.moduleVersion + '.html';
  }
}
