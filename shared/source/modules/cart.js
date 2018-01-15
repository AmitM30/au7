
import { inject }               from 'aurelia-framework';
import { InlineViewStrategy }   from 'aurelia-framework';

import { Review }               from '../services/review';
import { Request }              from '../services/request';
import { Cart as CartService }  from '../services/cart';
import { User }                 from '../services/user';
import { Messenger }            from '../services/messenger';
import { Common }               from '../services/common';
import { Notifier }             from '../services/notifier';
import { Config }               from '../services/config';
import { CartModel }            from '../models/cart-model';
import { Helpers }              from '../misc/helpers';

@inject(Review, Messenger, Config, Notifier, Common, CartModel, CartService, User, Request)
export class Cart {

  constructor (review, messenger, config, notifier, common, cartModel, cartService, user, request) {
    this.moduleVersion = config.moduleVersion;

    this.review = review;
    this.messenger = messenger;

    this.notifier = notifier;
    this.common = common;
    this.config = config;
    this.cart = cartService;
    this.cartModel = cartModel;
    this.user = user;
    this.request = request;
  }

  async activate (params, routeConfig) {
    this.viewName = routeConfig.name;
    this.common.pageType = routeConfig.name;
    this.common.bodyClass = 'section-cart';

    await this.orderCheck();

    window.dispatchEvent(new CustomEvent('cart-load', {  }));

    // TODO - uncomment when rendering cart from CMS panel
    // if (this.common.firstLoad && this.common.loadAPIData) {
    //   this.response = this.common.loadAPIData;
    //   this.customView = this.response.code !== 404 && this.response.render && this.response.render.templateId;
    // } else {
    //   this.request.backend('/' + routeConfig.name).then((response) => {
    //       this.response = response;
    //       this.customView = this.response.code !== 404 && this.response.render && this.response.render.templateId;
    //     });
    // }

    return this.user.getCities().then((res) => {
      this.setCities(res.meta.content);
    });
  }

  attached () {}

  orderCheck () {
    this.common.appLoading = true;
    return this.review.getCartData().then((res) => {
      this.common.appLoading = false;

      if (res.error) {
        this.notifier.setMessage(window.translate.messaging(res.error));
        return this.cart.count().then((count) => {
          if (count > 0) { return this.orderCheck(); }
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

      this.messenger.messages = res.messages;
    });
  }

  updateItemQuantity (event) {
    this.common.appLoading = true;
    this.review.updateItemQuantity(event.detail).then(() => { this.orderCheck(); });
  }

  remove (event) {
    this.common.appLoading = true;
    this.detail = event.detail;
    this.review.remove(event.detail).then((cart) => {
      this.cart.count().then((count) => {
        this.orderCheck();
      });
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

  getPromise (event) {
    let destination = null;

    if (event && event.detail) {
      destination = event.detail.destination
    } else if (this.cartModel.addresses && this.cartModel.addresses.shipping && this.cartModel.addresses.shipping.city) {
      destination = this.cartModel.addresses.shipping.city;
    }

    if (destination) {
      let request = {
        catalog_simple: [],
        destination,
        shop: this.config.locale.country
      };

      this.cartModel.products
        .map(
          (item) => {
            request.catalog_simple.push({
              sku_simple: item.data.selectedSimple.selectedSupplier.sku, 
              vendor_code: item.data.selectedSimple.selectedSupplier.vendor_code
            });
          }
        );

      return this.request.getPromise(request)
        .then((res) => {
          if (res.data && res.data.catalog_simple) {
            for (let simple in res.data.catalog_simple) {
              this.cartModel.products.map(
                (item) => {
                  if (item.data.selectedSimple.selectedSupplier.sku === simple) {
                    item.data.selectedSimple.selectedSupplier.delivery_info = res.data.catalog_simple[simple].expected_delivery_text;
                  }
                }
              );
            }
          }
          if (event && event.target) {
            event.target.showChangeCity = false;
          }
      });
    }
  }

  setCities (cities) {
    this.config.citiesList = Object.keys(cities).map((k) => {
      if (this.config.locale.lang == 'ar') {
        return { label: k, value: cities[k] };
      }

      return { label: cities[k], value: cities[k] };
    });
  }

  getViewStrategy () {
    // TODO - uncomment when rendering cart from CMS panel
    // if (this.customView) {
    //   this.json = Helpers.initAsyncRender(this.response.render);
    //   this.common.bodyClass = (this.response.render.overridingCSS) ? this.response.render.overridingCSS : this.common.bodyClass;

    //   if (this.response.render.templateString) {
    //     return new InlineViewStrategy(this.response.render.templateString);
    //     // return this.config.templateURL + this.config.site + '/' + this.config.templatePath + '/' + this.response.render.templateId + '/' + this.response.render.version + '.html';
    //   }
    // }

    return '/android_asset/www/modules/' + this.viewName + this.config.moduleVersion + '.html';
  }
}
