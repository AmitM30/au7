
import { inject }               from 'aurelia-framework';
import { EventAggregator }      from 'aurelia-event-aggregator';

import { Storage }              from './core/storage';
import { API }                  from './core/api';
import { Queue }                from './core/queue';
import { Common }               from './common';
import { Config }               from './config';

const DEFAULT_CART = { 'items': {}, 'vendors': {}, 'price': {}, 'version': 2 };

/**
 * Internal class
 */
class CartBaseClass extends Storage {

  constructor (api, config, common, ea) {
    super(config);

    this.api = api;
    this.cartName = config.api + '-cart';
    this.queue = new Queue();
    this.isCartReady = common.cartReady;

    ea.subscribe('cart-ready', () => {
      this.isCartReady = common.cartReady = true;
      this.queue.queue.map((obj) => {
        obj.resolve(this[obj.type](obj.data));
      });
    });
  }

  fetch () {
    if (!this.isCartReady) {
      return new Promise((resolve, reject) => {
        this.queue.enqueue({ type: 'fetch', resolve: resolve });
      });
    }

    return super.getItem(this.cartName).then((cart) => {
      if (typeof cart === 'string') {
        try {
          return JSON.parse(JSON.parse(cart).token);
        } catch (e) {
          super.setItem(this.cartName, DEFAULT_CART);
        }
      }

      return DEFAULT_CART;
    });
  }

  put (cart) {
    if (!this.isCartReady) {
      return new Promise((resolve, reject) => {
        this.queue.enqueue({ type: 'put', data: cart, resolve: resolve });
      });
    }

    return super.setItem(this.cartName, cart); //.then(this.fetch);
  }

  modify (fn) {
    return this.fetch().then(fn).then((cart) => { return this.put(cart); });
  }

  review (params, headers) {
    if (params.type === 'post') {
      return this.api.postRequest(this.config.apis.orderReview, params.cartModel).then((response) => response.json(), (err) => err.json()).catch((err) => err.json());
    }
    return this.api.getRequest(this.config.apis.review, params, headers).then((response) => response.json(), (err) => err.json()).catch((err) => err.json());
  }
}

/**
 * The Cart service is single point for all cart
 * related requests
 */
@inject(API, Config, Common, EventAggregator)
export class Cart extends CartBaseClass {

  constructor (api, config, common, ea) {
    super(api, config, common, ea);

    this.config = config;
    this.activate();
  }

  /**
   * Method to number of items in cart
   *
   * @returns {Promise} returns a promise cart length
   */
  count () {
    return this.log().then((cart) => {
      return cart && cart.items ? Object.keys(cart.items).length || 0 : 0;
    });
  }

  /**
   * Method to number of items in cart
   *
   * @returns {Promise} returns a promise cart length
   */
  length () {
    return this.log().then((cart) => {
      var count = 0;
      Object.keys(cart.items).map((item, index) => { count = count + parseInt(cart.items[item]); });
      return count;
    });
  }

  /**
   * Method to add item to cart
   *
   * @param {string} [sku] SKU
   * @param {Object} [vendorCode] Vendor Code
   * @param {Object} [price] SKU Price
   * @returns {Promise} returns a promise with cart object
   */
  add (sku, vendorCode, price) {
    return super.modify(function (cart) {
      // Hack to save carts with older mobile site issue
      // where price was not a part of default object
      Object.keys(DEFAULT_CART).map((val) => { cart[val] = cart[val] || {}; });
      cart.items[sku] = cart.items[sku] || 1;
      cart.vendors[sku] = vendorCode;
      cart.price[sku] = price;

      return cart;
    });
  }

  /**
   * Method to remove item from cart
   *
   * @param {string} [sku] SKU
   * @returns {Promise} returns a promise with cart object
   */
  remove (sku) {
    return super.modify(function (cart) {
      delete cart.items[sku];
      delete cart.vendors[sku];
      delete cart.price[sku];
      return cart;
    });
  }

  /**
   * Method to update quantity of item in cart
   *
   * @param {string} [sku] SKU
   * @param {number} [quantity] quantity
   * @returns {Promise} returns a promise with cart object
   */
  changeQuantity (sku, quantity) {
    return super.modify(function (cart) {
      cart.items[sku] = quantity;
      return cart;
    });
  }

  /**
   * Method to log cart surrent status
   *
   * @returns {Promise} returns a promise with cart object
   */
  log () {
    return super.fetch();
  }

  /**
   * Method to reset cart to default
   *
   * @returns {Promise} returns a promise with cart object
   */
  reset () {
    return super.put(DEFAULT_CART);
  }

  /**
   * Method to review cart at checkout
   *
   * @param {object} [paymentParams] Coupon Code, payment method, request type and cartmodel as propertiess
   * @returns {Promise} returns a promise with cart review object
   */
  review (paymentParams) {

    let params = {
      shop: this.config.locale.country,
      "payment[method]": paymentParams && paymentParams.paymentMethod ? paymentParams.paymentMethod : this.config.defaultPaymentMethod,
      "gift_option": paymentParams && paymentParams.giftOption ? paymentParams.giftOption : this.config.defaultGiftOption,
      "type": paymentParams.type || null,
      "cartModel": paymentParams.cartModel || null,
      "use_wallet": paymentParams.use_wallet || null
    };

    let headers = null;
    if (paymentParams.headers) {
      headers = paymentParams.headers;
    }

    if (paymentParams.email) {
      params.email = paymentParams.email;
    }

    if (!params.type && !params.cartModel) {
      delete params.type;
      delete params.cartModel;
    }

    if (paymentParams && paymentParams.couponCode) {
      params['coupon'] = paymentParams.couponCode;
    }

    return this.log().then((cart) => {
      if (!Object.keys(cart.items).length) {
        return { status: false, error: 'CART_EMPTY_ERROR' };
      }

      Object.keys(cart.items).forEach((sku) => {
        params['items[' + sku + ']'] = cart.items[sku];
        if (params.cartModel && params.cartModel.items[sku]) {
          params.cartModel.items[sku] = cart.items[sku];
        }
        if (cart.vendors[sku]) {
          params['vendors[' + sku + ']'] = cart.vendors[sku];
          if (params.cartModel && params.cartModel.vendors[sku]) {
            params.cartModel.vendors[sku] = cart.vendors[sku];
          }
        }
      });

      return super.review(params, headers).then((res) => {
        if (res.status_code && res.status_code !== 200) {
          return { status: false, error: 'Error' };
        }

        if (res.errors) {
          return res;
        }

        return res;
      });
    });
  }

  activate () { }
}

// Test Cases
// this.cart.add('SKU1', 'V0010', 1999).then((cart) => { console.log('ADDED: ', cart); });
// this.cart.add('SKU3', 'V0009', 2499).then((cart) => { console.log('ADDED: ', cart); });
// this.cart.remove('SKU3').then((cart) => { console.log('fetch: ', cart); });
// this.cart.reset().then((cart) => { console.log('reset: ', cart); });
// this.cart.log().then((cart) => { console.log('log: ', cart); });

// TODO
// - Check for alternatives if localStorage is not available - DONE
// - Push to backend to store user cart information - needs user info also - 'User'
