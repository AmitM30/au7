
import { inject }               from 'aurelia-framework';
import { Router }               from 'aurelia-router';

import { Config }               from './config';
import { Common }               from './common';
import { Cart }                 from './cart';
import { User }                 from './user';
import { CartModel }            from '../models/cart-model';
import { ProductDetailsModel }  from '../models/product-details';
import { ProductListingModel }  from '../models/product-listing';
import { Utils }                from '../misc/utils';

const DEFAULT_GA_OBJECT = {
  'WadiPageType': undefined,
  'ecommerce': {
    'currencyCode': undefined,
    'promoView': {
      'promotions': []
    },
    'impressions': []
  }
};

/**
 * Analytics class
 */
@inject(Config, Router, Common, CartModel, ProductDetailsModel, ProductListingModel, User, Cart)
export class Analytics {

  constructor (config, router, common, cartModel, productDetailsModel, productListingModel, user, cart) {
    this.common = common;
    this.cartModel = cartModel;
    this.pdpModel = productDetailsModel;
    this.plpModel = productListingModel;
    this.user = user;
    this.cart = cart;

    this.currency = config.locale.currency;
    this.country = config.locale.country;

    this.delayedObject = Utils.copyObject(DEFAULT_GA_OBJECT);
    this.immediateObject = Utils.copyObject(DEFAULT_GA_OBJECT);
    this.immediateObject = {};

    router.events.subscribe('router:navigation:success', () => {
      this.pageType = common.pageType === 'static' ? 'Marketing' : common.pageType;
      this.pageTypeName = null;
      if (this.pageType === 'list') {
        this.setPageTypeName();
      }
      this.setPageAnalytics();
    });
  }

  setPageTypeName () {
    let path = window.location.pathname;

    if (path.indexOf('/catalog') >= 0) {
      this.pageTypeName = 'Search';
    } else {
      let root = path.replace(/\//g, '');
      if (!root) { return; }
      switch(root.split('-').length) {
        case 0: this.pageTypeName = null;
          break;
        case 1: this.pageTypeName = 'Super Category';
          break;
        case 2: this.pageTypeName = 'Category';
          break;
        default: this.pageTypeName = 'Sub Category';
          break;
      }
    }
  }

  fireEvents (items, immediate) {
    items.map((value) => {
      let fnName = value.type.split('-').join('');
      if (this[fnName]) {
        this[fnName](value.data, value.object, immediate ? Utils.copyObject(this.immediateObject) : this.delayedObject );
      }
    });

    if (!immediate) {
      this.add(this.delayedObject);
      this.delayedObject = Utils.copyObject(DEFAULT_GA_OBJECT);
    }
  }

  /**
   * Method to push page type data to GA 'dataLayer' object
   *
   * @param {String} [type] object to push to GA's dataLayer
   * @returns {undefined} nothing
   */
  setPageAnalytics (type) {
    switch (this.pageType) {
      case 'detail': this.detailsview();
        break;
      case 'cart': // this.cartload();
        break;
    }

    if (!this.common.firstLoad) {
      this.add({ event: 'wPageLoad', WadiPageType: this.pageType, WadiCountry: this.country, WadiPageTypeName: this.pageTypeName, virtualUrl: window.location.href });
    }

    this.immediateObject = Utils.copyObject(DEFAULT_GA_OBJECT);
  }

  /**
   * Method to push data to GA 'dataLayer' object
   *
   * @param {Object} [data] object to push to GA's dataLayer
   * @returns {undefined} nothing
   */
  add (data) {
    data.WadiPageType = this.pageType;
    if (data) {
      window.dataLayer.push(data);
    }
  }

  /**
   * Method to add details page impression data to GA 'dataLayer' object
   *
   * @param {Object} [data] details page impressions data object
   * @param {Object} [obj] Add product GA obj structure
   * @returns {undefined} nothing
   */
  detailsview () {
    let toPush = {};
    let selected = this.pdpModel.product;

    // TODO
    try {
      toPush.id = selected.sku;
      toPush.name = selected.name;
      toPush.price = selected.specialPrice || selected.price;
      toPush.brand = (selected.brand) ? selected.brand.name : null;
      toPush.category = selected.category && selected.category.replace(/-/g, '/');
      toPush.variant = selected.sizes[0];
      toPush.visible = selected.visible;

      let detailsObj = { ecommerce: { detail: { actionField: {}, products: [] } } };
      detailsObj.ecommerce.detail.actionField.list = window.previousRoute.replace(window.location.origin, '').split('?')[0];
      detailsObj.ecommerce.detail.products.push(toPush);

      this.add(detailsObj);
    } catch (e) { }
  }

  /**
   * Method to add listings impressions data to GA 'dataLayer' object
   *
   * @param {Object} [data] listings product impressions data object
   * @param {Object} [obj] Add product GA obj structure
   * @returns {undefined} nothing
   */
  impressionslisting (data, obj, gaObj) {
    gaObj.ecommerce.currencyCode = this.currency;

    // TODO
    try {
      let toPush = {};
      toPush.id = data.product.sku;
      toPush.position = data.position;
      toPush.name = data.product.name;
      toPush.price = data.product.specialPrice || data.product.price;
      toPush.brand = (data.product.brand) ? data.product.brand.name : null;
      toPush.category = data.product.category && data.product.category.replace(/-/g, '/');
      toPush.variant = data.product.sizes[0];
      toPush.list = data.list;
      toPush.visible = data.product.visible;

      gaObj.event = 'impressions';
      gaObj.ecommerce.impressions.push(toPush);
    } catch (e) { }
  }

  /**
   * Method to add promo impressions data to GA 'dataLayer' object
   *
   * @param {Object} [data] promo impressions data object
   * @param {Object} [obj] Add product GA obj structure
   * @returns {undefined} nothing
   */
  promoview (data, obj, gaObj) {
    data.position = this.pageType + '|' + data.position;
    gaObj.event = 'impressions';
    gaObj.ecommerce.promoView.promotions.push(data);
  }

  /**
   * Method to add promo clicked data to GA 'dataLayer' object
   *
   * @param {Object} [data] promo click data object
   * @param {Object} [obj] Add product GA obj structure
   * @returns {undefined} nothing
   */
  promoclick (data, obj, gaObj) {
    let promoObj = {};
    if (obj.eventName) {
      promoObj.event = obj.eventName;
    }

    data.position = this.pageType + '|' + data.position;
    promoObj.ecommerce = { "promoClick": { "promotions": [] } };
    promoObj.ecommerce.promoClick.promotions.push(data);
    this.add(promoObj);
  }

  /**
   * Method to add product click data to GA 'dataLayer' object
   *
   * @param {Object} [data] click data object
   * @param {Object} [obj] Add product GA obj structure
   * @returns {undefined} nothing
   */
  productclick (data, obj, gaObj) {
    let productObj = {};
    if (obj.eventName) {
      productObj.event = obj.eventName;
    }

    let toPush = {};
    toPush.id = data.product.sku;
    toPush.name = data.product.name;
    toPush.price = data.product.specialPrice || data.product.price;
    toPush.brand = (data.product.brand) ? data.product.brand.name : null;
    toPush.category = data.product.category && data.product.category.replace(/-/g, '/');
    toPush.variant = data.product.sizes[0];
    toPush.position = data.position;

    productObj.ecommerce = { click: { actionField: { list: undefined }, products: [] } };
    productObj.ecommerce.click.actionField.list = data.list;
    productObj.ecommerce.click.products.push(toPush);

    this.msdClick(productObj, data);

    this.add(productObj);
  }

  /**
   * Method to push add to cart information to GA 'dataLayer' object
   *
   * @param {Object} [data] add to cart data object
   * @param {Object} [obj] Add product GA obj structure
   * @returns {undefined} nothing
   */
  addproduct (data, obj, gaObj) {
    let addObj = {};
    if (obj.eventName) {
      addObj.event = obj.eventName;
    }
    addObj.ecommerce = {};
    addObj.ecommerce.currencyCode = this.currency;
    addObj.ecommerce.add = {
      products: []
    };

    let toPush = {};
    toPush.id = data.item.sku.split('-')[0];
    toPush.quantity = 1;

    let selected = null;
    
    if (data.item && data.item.sku && data.item.vendor) {
      selected = data.item;
    } else {
       selected = this.pdpModel.getSimpleAndSupplier(data.item.sku, data.item.vendor, data.item)
    }

    if (selected.simple && selected.supplier) {
      toPush.name = this.pdpModel.product.name;
      toPush.price = selected.supplier.specialPrice || selected.supplier.price;
      toPush.brand = (this.pdpModel.product.brand) ? this.pdpModel.product.brand.name : null;
      toPush.category = this.pdpModel.product.category && this.pdpModel.product.category.replace(/-/g, '/');
      toPush.variant = selected.simple.size;
      toPush.visible = this.pdpModel.product.visible;
    }

    addObj.ecommerce.add.products.push(toPush);
    this.add(addObj);
  }

  /**
   * Method to push remove from cart information to GA 'dataLayer' object
   *
   * @param {Object} [data] remove item data object
   * @param {Object} [obj] Remove product GA obj structure
   * @returns {undefined} nothing
   */
  removeitem (data, obj, gaObj) {
    let removeObj = {};
    if (obj.eventName) {
      removeObj.event = obj.eventName;
    }

    if (data.item.sku) {

      let toPush = {};
      toPush.id = data.item.sku.split('-')[0];
      toPush.name = data.product.name;
      toPush.name = data.product.name;
      toPush.price = data.product.selectedSimple.selectedSupplier.specialPrice || data.product.selectedSimple.selectedSupplier.price;
      toPush.brand = (data.product.brand) ? data.product.brand.name : null;
      toPush.category = data.product.category && data.product.category.replace(/-/g, '/');
      toPush.variant = data.product.selectedSimple.size;
      toPush.visible = data.product.visible;
      toPush.quantity = 1;

      removeObj.ecommerce = { "remove": { "products": [] } };
      removeObj.ecommerce.remove.products.push(toPush);
      this.add(removeObj);
    }
  }

  /**
   * Method to add product impressions data to GA 'dataLayer' object
   *
   * @param {Object} [data] impressions data object
   * @param {Object} [obj] Add product GA obj structure
   * @returns {undefined} nothing
   */
  impressionsproduct (data, obj, gaObj) {
    let toPush = {};
    toPush.id = data.product.sku;
    toPush.name = data.product.name;
    toPush.price = data.product.specialPrice || data.product.price;
    toPush.brand = (data.product.brand) ? data.product.brand.name : null;
    toPush.category = data.product.category && data.product.category.replace(/-/g, '/');
    toPush.variant = data.product.sizes[0];
    toPush.list = data.list;
    toPush.position = data.position;

    gaObj.event = 'impressions';
    gaObj.ecommerce.impressions.push(toPush);
  }

  /**
   * Method to cart data to GA 'dataLayer' object on cart load
   *
   * @param {Object} [data] impressions data object
   * @param {Object} [obj] Add product GA obj structure
   * @returns {undefined} nothing
   */
  cartload () {
    let cartObj = {};
    cartObj.event = 'CartLoad';
    cartObj.ecommerce = {};
    cartObj.ecommerce.currencyCode = this.currency;
    cartObj.ecommerce.country = this.country;
    cartObj.ecommerce.onload = { products: [] };

    if (this.cartModel.products && this.cartModel.products.length) {
      this.cart.log().then((cart) => {
        Object.keys(cart.items).map((sku) => {
          let toPush = {};
          let skuData = this.cartModel.products.find((d) => { return d.data.sku === sku.split('-')[0]; });
          skuData = skuData && skuData.data;

          let quantity = cart.items[sku].quantity;
          quantity = !isNaN(quantity) ? parseInt(quantity) : quantity;
          toPush.id = skuData.sku;
          toPush.name = skuData.name;
          toPush.price = skuData.specialPrice || skuData.price;
          toPush.brand = (skuData.brand) ? skuData.brand.name : null;
          toPush.category = skuData.category && skuData.category.replace(/-/g, '/');
          toPush.variant = skuData.sizes[0];
          toPush.quantity = quantity;

          cartObj.ecommerce.onload.products.push(toPush);
        });
      });
    }

    this.add(cartObj);
  }

  /**
   * Method to push existing cart to dataLayer before checkout
   *
   * @param {Object} [data] impressions data object
   * @param {Object} [obj] Add product GA obj structure
   * @returns {undefined} nothing
   */
  checkoutnow (data, obj, gaObj) {
    gaObj.ecommerce = { checkout: { actionField: { step: 1, option: '' }, products: [] } };
    if (obj.eventName) {
      gaObj.event = obj.eventName;
    }

    gaObj.ecommerce.testing = this.cartModel.testing;

    this.cart.log().then((cart) => {
      Object.keys(cart.items).map((sku) => {
        let toPush = {};
        let skuData = this.cartModel.products.find((d) => { return d.data.sku === sku.split('-')[0]; });
        skuData = skuData.data;
        toPush.id = skuData.sku;
        toPush.name = skuData.name;
        toPush.price = skuData.specialPrice || skuData.price;
        toPush.brand = (skuData.brand) ? skuData.brand.name : null;
        toPush.category = skuData.category && skuData.category.replace(/-/g, '/');
        toPush.variant = skuData.sizes[0];
        toPush.quantity = cart.items[sku];

        gaObj.ecommerce.checkout.products.push(toPush);
      });

      this.add(gaObj);
    });
  }

  /**
   * Method to measure checkout steps
   *
   * @param {Object} [data] impressions data object
   * @param {Object} [obj] Add product GA obj structure
   * @returns {undefined} nothing
   */
  checkoutstep (data, obj, gaObj) {
    gaObj.ecommerce = { checkout_option: { actionField: { step: data.step, option: data.option } } };
    gaObj.ecommerce.checkout = { actionField: { step: data.step, option: data.option }, products: [] };
    if (obj.eventName) {
      gaObj.event = obj.eventName;
    }

    gaObj.ecommerce.testing = this.cartModel.testing;

    this.cart.log().then((cart) => {
      Object.keys(cart.items).map((sku) => {
        let toPush = {};
        let skuData = this.cartModel.products.find((d) => { return d.data.sku === sku.split('-')[0]; });
        skuData = skuData.data;
        toPush.id = skuData.sku;
        toPush.name = skuData.name;
        toPush.price = skuData.specialPrice || skuData.price;
        toPush.brand = (skuData.brand) ? skuData.brand.name : null;
        toPush.category = skuData.category && skuData.category.replace(/-/g, '/');
        toPush.variant = skuData.sizes[0];
        toPush.quantity = cart.items[sku];

        gaObj.ecommerce.checkout.products.push(toPush);
      });

      this.add(gaObj);
    });
  }

  /**
   * Method to push transaction success to GA dataLayer
   *
   * @param {Object} [data] impressions data object
   * @param {Object} [obj] Add product GA obj structure
   * @returns {undefined} nothing
   */
  checkoutpurchase (data, obj, gaObj) {
    gaObj.ecommerce = { purchase: { actionField: { id: data.order.order_nr }, products: [] } };
    if (obj.eventName) {
      gaObj.event = obj.eventName;
    }
    gaObj.ecommerce.purchase.actionField.revenue = parseInt(data.order.invoice[7].value) / 100;
    gaObj.ecommerce.purchase.actionField.cod_fee = parseInt(data.order.invoice[1].value) / 100;
    gaObj.ecommerce.purchase.actionField.shipping = parseInt(data.order.invoice[2].value) / 100;
    gaObj.ecommerce.purchase.actionField.coupon = data.order.coupon;
    gaObj.ecommerce.purchase.actionField.currency = this.currency;

    Object.keys(data.cart.items).map((sku) => {
      let toPush = {};
      if (this.cartModel.products) {
        let skuData = this.cartModel.products.find((d) => { return d.data.sku === sku.split('-')[0]; });
        skuData = skuData.data;
        toPush.id = skuData.sku;
        toPush.name = skuData.name;
        toPush.price = skuData.specialPrice || skuData.price;
        toPush.brand = (skuData.brand) ? skuData.brand.name : null;
        toPush.category = skuData.category && skuData.category.replace(/-/g, '/');
        toPush.variant = skuData.sizes[0];
        toPush.quantity = data.cart.items[sku];

        gaObj.ecommerce.purchase.products.push(toPush);
      }
    });
  }

  /**
   * Method to push user information to dataLayer
   *
   * @param {Object} [data] update quantity data object
   * @param {Object} [obj] Update product GA obj structure
   * @returns {undefined} nothing
   */
  userloaded (data, obj, gaObj) {
    gaObj.event = obj.eventName;
    gaObj.ecommerce = { user: { customer: "", email: this.user.info.email } };

    this.add(gaObj);
  }

  /**
   * Method to push swiper events to dataLayer
   *
   * @param {Object} [e] event source
   * @returns {undefined} nothing
   */
  swiperswiped (e) {
    let obj = { event: 'carouselSwipe', ecommerce: {} };
    obj.pageType = this.pageType;
    obj.currency = this.currency;
    let url = e.detail.url && e.detail.url.split('?')[1];
    if (url) {
      let queryParams = JSON.parse('{"' + decodeURI(url).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
      obj.widgetID = queryParams.widgets;
      obj.customerID = Utils.readCookie('MADid');
  
      this.add(obj);
    }
  }


  /**
   * Method to push swiper events to dataLayer
   *
   * @param {Object} [e] event source
   * @returns {undefined} nothing
   */
  msdClick (d, e) {
    let obj = { event: 'carouselClick', ecommerce: {
        destProdID: e.product.sku,
        destCategID: e.product.category,
        position: e.position
      }
    };

    obj.pageType = this.pageType;
    obj.currency = this.currency;
    let url = e.url && e.url.split('?')[1];

    if (url) {
      let queryParams = JSON.parse('{"' + decodeURI(url).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
      obj.widgetID = queryParams.widgets;
      obj.customerID = Utils.readCookie('MADid');
  
      this.add(obj);
    }
  }

  /**
   * Method to push update quantity cart information to GA 'dataLayer' object
   *
   * @param {Object} [data] update quantity data object
   * @param {Object} [obj] Update product GA obj structure
   * @returns {undefined} nothing
   */
  updatequantity (data, obj, gaObj) {
    // console.log('updatequantity -> data, obj: ', data, obj);
    // obj.id = data.sku.split('-')[0];
    // obj.sku = data.sku;

    // gaObj.ecommerce.add.products.push(obj);
  }
}
