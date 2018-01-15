
import { autoInject, computedFrom } from 'aurelia-framework';

import { Config }               from '../services/config';

// @inject(Config)
export class ProductDetailsModel {

  constructor (config) {
    this.lang = config.locale.lang;
    this.product = {};
  }

  // @computedFrom('product')
  get specification () {
    if(Object.keys(this.product.attributesMap.groups).length) {
      return this.product.attributesMap;
    }
  }

  // @computedFrom('product')
  get isOutOfStock () {
    return this.product.visible === 1 ? false : true;
  }

  get breadcrumbs () {
    return this.product.breadcrumbs;
  }

  productImages () {
    let images = { 'assets': [] };

    if (this.product.maxImages && this.product.maxImages > 0) {
      for (let i = 1; i <= this.product.maxImages; i++) {
        images.assets.push({
          imageUrl: '//b.wadicdn.com/product/' + this.product.imageKey + '/' + i + '-product.jpg',
          zoomUrl: '//b.wadicdn.com/product/' + this.product.imageKey + '/' + i + '-zoom.jpg'
        });
      }
    }
    else {
      images.assets.push({
        imageUrl: '/dist/images/product-default-product-' + this.lang + '.png',
        zoomUrl: '/dist/images/product-default-product-' + this.lang + '.png'
      });
    }

    return images;
  }

  productInfo () {
    let pi = {
      'title': this.lang === 'en' ? 'Product Information' : 'معلومات المنتج',
      'viewMoreTitle': this.lang === 'en' ? 'View Full Description' : 'اعرض الوصف الكامل',
      'assets': []
    };

    this.product.description.map(function (value) {
      if (value.hasOwnProperty('type') && value.type === 'introduction') {
        pi.introduction = value.text;
        if (value.media && value.media.indexOf('youtube') >= 0) {
          pi.video = value.media;
        } else if (value.media) {
          pi.image = value.media;
        }
      } else {
        let info = { 'title': value.title, 'description': value.text };
        if (value.image) {
          info.image = value.image;
        }
        if (value.video) {
          info.video = value.video;
        }
        pi.assets.push(info);
      }
    });

    return pi;
  }

  addToCartProduct (sku) {
    let json = {
      'sku': null,
      'vendor': null,
      'price': null
    };

    if (sku) {
      json.sku = sku;
      let found = this.product.simples.find(function (d) { return d.sku === sku; });
      if (found.suppliers && found.suppliers.length > 0) {
        json.vendor = found.suppliers[0].vendor_code;
        json.price = found.suppliers[0].specialPrice || found.suppliers[0].price;
      }

      return json;
    }

    json.sku = this.product.simples[0].sku;
    json.vendor = (this.product.simples[0].suppliers && this.product.simples[0].suppliers.length) ? this.product.simples[0].suppliers[0].vendor_code : undefined;
    json.price = (this.product.simples[0].suppliers && this.product.simples[0].suppliers.length) ? this.product.simples[0].suppliers[0].specialPrice || this.product.simples[0].suppliers[0].price : this.product.offerofferPrice || this.product.price;

    return json;
  }

  getSimpleAndSupplier (sku, vendor, item) {
    let simple = item.simples.find(function (d) { return d.sku === sku; });
    let supplier = {};
    if (simple && vendor) {
      supplier = simple.suppliers.find(function (d) { return d.vendor_code === vendor; });
    }

    return { simple: simple, supplier: supplier };
  }
}
