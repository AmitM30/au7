
import { inject }               from 'aurelia-framework';
import { EventAggregator }      from 'aurelia-event-aggregator';

import { Cart }                 from './cart';
import { User }                 from './user';
import { Common }               from './common';
import { Config }               from './config';
import { CartModel }            from '../models/cart-model';
import { Review }               from './review';
import { Utils }                from '../misc/utils';

/**
 * The app wrapper service is single point for all app
 * related operations
 */

@inject(Cart, User, Common, Config, EventAggregator, CartModel, Review)
export class AppWrapper {

  constructor(cart, user, common, config, ea, cartModel, review) {
    this.cart = cart;
    this.user = user;
    this.common = common;
    this.config = config;
    this.ea = ea;
    this.cartModel = cartModel;
    this.review = review;
  }

  /**
   * Initializes the app for platforms like iOS and Android
   *
   * Set `device` attribute under this.common for
   * `isApp`, `udid`, `deviceId`, `version` and `platform`
   */
  async init () {
    this.common.device.platform = Utils.getQueryParameter('platform');
    this.common.device.isApp = this.config.app.header.value.indexOf(Utils.getQueryParameter(this.config.app.header.key)) !== -1  ? true : false;
    this.common.device.isFMCG = Utils.getQueryParameter(this.config.app.header.key) === 'fmcg' ? true : false;

    let fn = async (resolve) => {
      if (window.order.email.indexOf(this.config.app.debugClause) >= 0) { this.common.device.debug = true; }

      this.common.device.isApp = true;

      // reset the web-view cart, as it has no control over cart of app
      await this.cart.reset();
      // update web-view cart
      updateCart.call(this, window.order.orderReview.items);

      await this.user.guestLogin({ email: window.order.email });

      // if (window.order.phoneNumber) {
      //   this.user.info.skipPhoneVerification = true;
      //   this.user.info.primaryPhone = window.order.phoneNumber;
      // }

      this.common.device.udid = this.common.device.udid || window.order.udid || 'xxxx-xxxx-xxxx-xxxx';
      this.common.device.deviceId = this.common.device.deviceId || window.order.deviceId;
      this.common.device.version = this.common.device.version || window.order.version;

      setCookie('media', 'app', '/', this.config.domain);

      this.debug('Cart Imported -> ' + JSON.stringify(window.order) + '; Device -> ' + JSON.stringify(this.common.device));
      this.initAnalytics();
      this.androidAppInputFocus();

      resolve();
    }

    if (this.common.device.platform) {
      this.config.platform = this.common.device.platform;
      this.common.device.udid = Utils.getQueryParameter('udid');
      this.common.device.version = Utils.getQueryParameter('version');

      if (window.order) {
        return new Promise((resolve) => { fn.call(this, resolve); });
      } else {
        return new Promise((resolve) => { window.addEventListener('checkoutImport', (order) => { fn.call(this, resolve); }); });
      }
    }

    return new Promise((resolve) => { resolve(); });
  }

  initAnalytics () {
    return new Promise((resolve, reject) => {
      // Set UTM params
      if (window.order.sources) {
        this.debug('initAnalytics -> sources ' + JSON.stringify(window.order.sources) + '; domain: ' + this.config.domain);
        initSourceTracking(window.order.sources, this.config.domain);
      }

      this.ea.subscribe('router:navigation:complete', async (navigationInstruction) => {
        if (navigationInstruction.instruction.config.name === 'checkout') {
          switch (true) {
            case /shipping/.test(navigationInstruction.instruction.params.childRoute):
              break;
            case /payment/.test(navigationInstruction.instruction.params.childRoute):
              this.sendAppMessage('checkoutOption', {
                type: 'ga',
                step: '3',
                option: this.cartModel.payment.method === 'cod' ? 'COD' : 'Credit Card'
              });
              break;
            case /success/.test(navigationInstruction.instruction.params.childRoute):
              let order = await this.review.getOrderFromStorage();
              let packet = {
                type: 'ga',
                transactionId: this.cartModel.orderNumber,
                affiliation: 'store',
                revenue: this.cartModel.cartReviewData.invoice[7].value,
                tax: 0,
                shipping: this.cartModel.cartReviewData.invoice[2].value,
                currency: this.config.locale.currency,
                order: order
              };
              this.sendAppMessage('trackOrder', packet);
              break;
          }
        }

        resolve();
      });
    });
  }

  initFMCG () {
    if (window.order.misc && window.order.misc.appName === this.config.app.fmcg) {
      this.common.device.isFMCG = true;
      setCookie('media', 'fmcg', '/', this.config.domain);
      this.cartModel.is_express_delivery = window.order.orderReview.is_express_delivery;
      this.cartModel.selected_slot = window.order.orderReview.selected_slot;
      this.cartModel.selected_date = window.order.orderReview.selected_date;

      this.config.quantityOptions = this.config.app.fmcgQuanityOptions;
    }
  }

  /**
   * Sends `data` to the mobile app.
   *
   * It will create an iFrame to communicate with the hosting app creating an url
   * with the given `path` passing `data` as query parameters.
   *
   * @param {String} [path] path for app
   * @param {Object} [data] data to send
   */
  sendAppMessage (path, data) {
    path = this.config.app.link + '://' + path + '?' + encodeURIComponent(JSON.stringify(data));
    this.debug('>>> sendAppMessage -> ' + path);

    let iFrame = window.document.createElement('IFRAME');

    iFrame.setAttribute('src', path);
    window.document.body.appendChild(iFrame);
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
  }

  /**
   * Add event listener for focusin and focusout event to scroll input on focus inside view for android app
   * @return promise
   */
  androidAppInputFocus () {
    return new Promise((resolve, reject) => {
      if (this.common.device.platform === 'android') {
        this.focusInInput = window.addEventListener('focusin', (event) => {
          if (event.target && event.target.tagName && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) {
            document.querySelector("#wrapper").classList.add("android");
            this.common.smoothScrollTo(event.target);
          }
        });

        this.focusOutInput = window.addEventListener('focusout', (event) => {
          document.querySelector("#wrapper").classList.remove("android");
        });
      }
      resolve();
    });
  }

  /**
   * Uses third party error logging tool for capturing app debug logs
   *
   * @param {String} [message] message to send
   */
  debug (message) {
    return new Promise((resolve, reject) => {
      if (this.common.device.debug) {
        message = typeof message === 'object' ? JSON.stringify(message) : message;
        window.Raven && window.Raven.captureException('DEBUG: ' + message);

        this.log(message);
      }

      resolve();
    });
  }

  /**
   * Creates a debug area on top of the page (if needed) and
   * appends the required message. Useful for mobile apps
   * were we can't console.log() and alert is annoying
   * (and sometimes doesn't really happens on android)
   *
   * @param {String} [message] message to display
   */
  log (message) {
    return new Promise((resolve, reject) => {
      if (this.common.device.debug) {
        if (this.debugDiv === undefined) {
          let p = document.createElement('p');
          p.id = 'debug'; p.style.backgroundColor = 'white'; p.style.border = '2px solid red'; p.style.wordWrap = 'break-word';
          p.innerHTML = 'LOG!!! <br /><br />';
          document.querySelector('body').prepend(p);
          this.debugDiv = document.querySelector('#debug');
        }

        message = typeof message === 'object' ? JSON.stringify(message) : message;
        this.debugDiv.innerHTML = this.debugDiv.innerHTML + message + '<br /><br />';
      }

      resolve();
    });
  }
}

let setCookie = function (key, value, path, domain, expiry) {
  window.document.cookie = key + '=' + value + '; path=' + path + '; domain=.' + domain + ';' +
                                  (expiry ? ' expires=' + expiry + ';' : '');
};

let updateCart = function (items) {
  let arr = []
  Object.keys(items).map((val) => { arr.push({ val: val, quantity: items[val].quantity }); });

  let index = 0;
  let addItems = (sku, quantity) => {
    this.cart.changeQuantity(sku, quantity).then(() => {
      index++;
      if (index < arr.length) { addItems(arr[index].val, arr[index].quantity); }
    });
  };
  addItems(arr[0].val, arr[0].quantity);
};

let initSourceTracking = function (sources, domain) {
  let now = new Date();
  now.setDate(now.getDate() + 1);

  Object.keys(sources).map((key) => {
    setCookie(key, sources[key], '/', domain, now.toUTCString());
  });
};
