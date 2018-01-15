
import { inject }               from 'aurelia-framework';

import { Request }              from './request';
import { Cart as CartService }  from './cart';
import { Common }               from './common';
import { API }                  from './core/api';
import { Config }               from './config';
import { User }                 from './user';
import { CartModel }            from '../models/cart-model';
import { Utils }                from '../misc/utils';
import { Storage }              from '../services/core/storage';

/**
 * Saves the order to the storage
 */
let saveOrder = function (order, storage, config) {
  let currentOrder = {
      email: order.email,
      invoice: order.invoice,
      items: order.items,
      vendors: order.vendors,
      t: order.t,
      order_nr: order['order_nr'],
      shop: order.shop,
      order: order
  };

  // "has_valid_id_document": order["has_valid_id_document"],
  // "is_phone_verified":     order["is_phone_verified"],
  // "is_first_order":        order["is_first_order"],
  // "addresses": {
  //     "shipping": {
  //         "name":    order.addresses.shipping.name,
  //         "phone":   order.addresses.shipping.phone,
  //         "city":    order.addresses.shipping.city,
  //         "country": order.addresses.shipping.country
  //     }
  // }

  return storage.setItem(config, currentOrder).then(() => {
    return new Promise ((resolve, reject) => {
      resolve(order);
    });
  });
}

@inject(API, Config, CartService, Request, Common, CartModel, User, Storage)
export class Review {

  constructor (api, config, cartService, request, common, cartModel, user, storage) {
    this.api = api;
    this.config = config;
    this.quantityOptions = config.quantityOptions;
    this.cart = cartService;
    this.request = request;
    this.common = common;
    this.user = user;
    this.cartModel = cartModel;
    this.storage = storage;

    this.init();
  }

  getCartData (params) {
    let res = { messages: [], cartReview: null };

    params = params || {};
    params.headers = {};
    params.couponCode = params.couponCode || this.cartModel.coupon;
    params.giftOption = params.giftOption || this.cartModel.gift_option;
    params.paymentMethod = params.paymentMethod || this.cartModel.payment.method;
    params.use_wallet = this.cartModel.use_wallet;

    if (this.cartModel.addresses && this.cartModel.addresses.shipping && this.cartModel.addresses.shipping.city) {
      params.headers.city = this.cartModel.addresses.shipping.city;
    }

    if (this.user.info.email) {
      params.email = this.user.info.email;
    }

    return new Promise((resolve, reject) => {
      return this.cart.review(params).then((cartReview) => {
        this.cart.length().then((count) => { this.common.cartCount = count; });
        if (typeof cartReview.status !== 'undefined' && !cartReview.status) {
          this.cartModel.products = null;
          this.cartModel.details = null;
        }

        res.cartReview = cartReview;
        this.cartModel.testing = res.cartReview['a_b'];

        if (cartReview.errors) {
          // If failed due to invalid coupon code
          if (cartReview.errors.coupon) {
            switch(cartReview.errors.coupon) {
              case 'NOT_FOUND':
              case 'INVALID_CATEGORY':
              case 'INVALID_SUBTOTAL': 
              default: this.cartModel.coupon = null;
            };

            res.error = cartReview.errors.coupon;
            return resolve(res);
          }

          if (cartReview.errors.payment) {
            return resolve(res);
          }
          
          // If failed due to update quantity
          if (this.cartState) {
            return this.cart.changeQuantity(this.cartState.sku, this.cartState.quantity).then(() => {
              res.error = window.translate.messaging('LIMITED_STOCK_ERROR') + this.cartState.sku;
              this.cartState = null;

              return resolve(res);
            });
          }

          let removeFn = [];
          Object.keys(cartReview.errors.items).forEach((sku) => {
            let fn = function (s) {
              this.cart.remove(sku);
              res.error = cartReview.errors.items[sku].message;
              return this.request.product(s);
            };
            removeFn.push(fn.call(this, sku));
          });

          return Promise.all(removeFn).then((results) => {
            res.oosItems = results;
            return resolve(res);
            // review call for remaining items
            // this.getCartData();
          });
        }

        if (cartReview.error) {
          res.error = cartReview.error;
          return resolve(res);
        }


        // Everthing is good, so:
        this.cartModel.cartReviewData = res.cartReview;
        if (cartReview.offer) {
          for (var i = 0; i < cartReview.offer.length; i++) {
            res.messages.push(cartReview.offer[i].message);
          }
        }

        let callFn = [];
        Object.keys(cartReview.items).forEach((sku) => {
          let fn = function (s) {
            return this.request.product(s);
          };
          callFn.push(fn.call(this, sku));
        });

        return Promise.all(callFn).then((results) => {
          let products = results;

          this.cart.log().then((cart) => {
            Object.keys(cartReview.items).forEach((sku, index) => {
              for (let len = products[index].data.simples.length, i = 0; i < len; i++) {
                let supplier = {};
                if (cart.vendors[sku]) {
                  supplier = products[index].data.simples[i].suppliers.find(function (d) { return d.sku === sku && d.vendor_code === cart.vendors[sku]; });
                } else {
                  supplier = products[index].data.simples[i].suppliers.find(function (d) { return d.sku === sku });
                }
                if (supplier) {
                  products[index].data.selectedSimple = products[index].data.simples[i];
                  products[index].data.selectedSimple.selectedSupplier = supplier;

                  break;
                }
              }
              products[index].data.quantityOptions = this.config.quantityOptions;

              delete products[index].data.simples;
              delete products[index].data.selectedSimple.suppliers;
            });

            this.cartModel.items = cart.items;
            this.cartModel.vendors = cart.vendors;
            
            products.map((item) => {
              for (let el in cartReview.items) {
                if (cartReview.items.hasOwnProperty(el)) {
                  if (item.data.selectedSimple.selectedSupplier.sku === el) {
                    item.data.selectedSimple.selectedSupplier.delivery_info = cartReview.items[el].delivery_info;
                  }
                }
              }
            });
            this.cartModel.products = products;
            this.cartModel.details = res.cartReview;
            if (this.cartModel.payment.method && res.cartReview && res.cartReview.allowed_payment_method[this.cartModel.payment.method].allowed) {
              this.cartModel.payment.method = res.cartReview.payment.method;
            } else {
              this.cartModel.payment.method = this.config.defaultPaymentMethod;
            }
            if (this.cartModel.cartReviewData.invoice[3].value > 0) {
              this.cartModel.coupon = params.couponCode;
            }

            this.cart.length().then((count) => { this.common.cartCount = count; });
            resolve(res);
          });
        });
      });
    });
  }

  postCartData (params) {
    params = params || {};
    params.type = 'post';

    return this.cart.log().then((cart) => {
      this.cartModel.items = cart.items;
      this.cartModel.vendors = cart.vendors;
      params.cartModel = formatOrder(this.cartModel, this.user.info.email, this.config, this.user.info.isPhoneVerified);

      return this.getCartData(params);
    });
  }

  remove (detail) {
    return this.cart.remove(detail.item.sku);
  }

  updateItemQuantity (detail) {
    this.cart.log().then((cart) => {
      this.cartState = { sku: detail.sku, quantity: cart.items[detail.sku] };
    });

    return this.cart.changeQuantity(detail.sku, detail.quantity);
  }

  coupon (val) {
    return this.getCartData(val);
  }

  order () {
    this.cartModel.details.payment = Utils.copyObject(this.cartModel.payment);

    let orderProcessing = formatOrder(this.cartModel, this.user.info.email, this.config, this.user.info.isPhoneVerified);
    setUTMCookies(this.config.tracking, orderProcessing);

    return this.api.postRequest(this.config.apis.order, orderProcessing).then((response) => {
        return response.json().then((res) => {
          saveOrder(res, this.storage, this.config.token.currentOrder);

          if (res.redirect) {
            let redirectData = Object.assign(res.redirect, res.payment.card);
            submitPaymentCCForm(redirectData);
            
            return { redirect: true };
          } else {
            return res;
          }
        });
      }).catch((err) => err.json());
  }

  getOrderFromStorage () {
    return this.storage.getItem(this.config.token.currentOrder).then((res) => {
      return Utils.stringToJSON(Utils.stringToJSON(res).token);
    });
  }

  clearCookiesOnSuccess () {
    return Promise.all([
      this.storage.removeItem(this.config.token.currentOrder),
      this.cart.reset()
    ]);
  }

  // TODO - Do we need this method ?
  orderReview () {
    formatOrder(this.cartModel, this.user.info.email, this.config.token.currentOrder);
    return this.api.postRequest(this.config.apis.orderReview, this.cartModel)
      .then((response) => response.json(), (err) => err.json());
  }

  init () {
    // console.log('Activate: REVIEW');
  }
}

let submitPaymentCCForm = function (formData) {
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

let formatOrder = function (cartModel, userEmail, config, isPhoneVerified) {
  let order = Utils.copyObject(cartModel);
  let card = order.payment && order.payment.card ? Utils.copyObject(order.payment.card) : null;
  let nameParts = [];

  if (order.addresses.billing && !order.addresses.billing.name) {
    order.addresses.billing = order.addresses.shipping;
  }

  if (card && card.first_name) {
    nameParts = card.first_name.trim().split(' ');
    if (nameParts.length <= 1) {
      card.first_name = nameParts.toString();
      card.last_name = config.user.fallBackLastName;
    } else {
      card.first_name = nameParts.slice(0, 1).join(' ').toString();
      card.last_name = nameParts.slice(1, nameParts.length).join(' ').toString();
    }
    order.payment.card = card;
    order.details.payment.card = card;
  }

  if (order.payment.method !== 'cc') {
    delete order.payment.card;
    delete order.details.payment.card;
  }

  if (order.payment.card) {
    for (var prop in cartModel.getDefaultCCObject()) {
      order.payment.card[prop] === null && delete order.payment.card[prop];
    }
  }

  order.email = userEmail;
  let tempOrder = cartModel.getDefaultOrderObject();

  for (let j in tempOrder) {
    tempOrder[j] = order[j];
  }

  if (tempOrder.payment.method !== 'cc') {
    delete tempOrder.payment.card;
    delete tempOrder.payment.token;
    delete tempOrder.details.payment.token;      
    delete tempOrder.details.payment.card;
  }

  if (tempOrder.payment.method === 'cc') {
    if (tempOrder.payment.token && !tempOrder.payment.token.id) {
      delete tempOrder.payment.token;      
      delete tempOrder.details.payment.token;      
    }

    if (tempOrder.payment.card && !tempOrder.payment.card.number) {
      delete tempOrder.payment.card;
      delete tempOrder.details.payment.card;
    }
  }

  tempOrder.is_phone_verified = isPhoneVerified;

  if (!isPhoneVerified) {
    if (tempOrder.addresses.shipping) { tempOrder.addresses.shipping.alternate_phone = null; }
    if (tempOrder.addresses.billing) { tempOrder.addresses.billing.alternate_phone = null; }
  }

  return tempOrder;
};

let setUTMCookies = function (cookies, tempOrder) {
  try {
    let appCookies = Utils.cookieToJson();
    [].forEach.call(cookies.utm, (utm) => { tempOrder[utm] = decodeURIComponent(appCookies[utm] || ''); });
    [].forEach.call(cookies.lasttouch, (lasttouch) => { tempOrder[lasttouch] = decodeURIComponent(appCookies[lasttouch] || ''); });
  } catch (e) { }
};
