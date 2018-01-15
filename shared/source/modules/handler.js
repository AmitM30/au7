
import { inject }               from 'aurelia-framework';
import { InlineViewStrategy }   from 'aurelia-framework';
import { Router, activationStrategy }   from 'aurelia-router';

import { Common }               from '../services/common';
import { Request }              from '../services/request';
import { Cart }                 from '../services/cart';
import { User }                 from '../services/user';
import { Config }               from '../services/config';
import { ProductDetailsModel }  from '../models/product-details';
import { ProductListingModel }  from '../models/product-listing';
import { Utils }                from '../misc/utils';
import { Helpers }              from '../misc/helpers';

@inject(Common, Request, Router, Cart, Config, ProductDetailsModel, ProductListingModel, User)
export class Handler {

  constructor (common, request, router, cart, config, productDetailsModel, productListingModel, user) {
    this.common = common;
    this.request = request;
    this.router = router;
    this.cart = cart;
    this.config = config;
    this.user = user;

    this.productsModel = productDetailsModel;
    this.productsListingModel = productListingModel;
  }

  initPDP (response) {
    this.productsModel.product = response.data;
    this.inCartSku = [];
    this.selectedSize = null;
    let firstVariation = (this.productsModel.product.simples && this.productsModel.product.simples.length > 0) ? this.productsModel.product.simples[0] : {};
    this.request.reviews({ key: firstVariation.sku }).then((data) => {
      if (data && data.score) {
        this.productsModel.reviews = data;
        this.expertReviewUrl = data.pro_review_url ? data.pro_review_url.replace('js?pid', 'json?pid') : null;
        this.userReviewUrl = data.user_review_url ? data.user_review_url.replace('js?pid', 'json?pid') : null;
      }
    });

    let fnInit = function (cart) {
      this.inCartSku = [...Object.keys(cart.items)];
      let found = this.productsModel.product.simples.find(function (simple) {
          return simple.suppliers.find((supplier) => {
            if(cart.items[supplier.sku]) {
              return supplier;
            }
          });
      });

      // If particular sku (any variation) is in cart
      let simpleDefault = this.productsModel.product.simples.find((simple) => {
        if(cart.items[simple.sku]) {
          return simple;
        }
      });

      this.selectedSize = (simpleDefault && simpleDefault.size) ? simpleDefault.size : null;

      this.productAlreadyInCart = (simpleDefault && simpleDefault.sku ? true : false);

      // true if in cart or electronics
      this.selectedSKU = found ? found.sku
                          : (firstVariation.size === 'OS') ? firstVariation.sku : undefined;
      this.selectedSimple = found || firstVariation;
      this.defaultProduct = this.productsModel.addToCartProduct(this.selectedSKU || undefined);
    };

    this.cart.log().then((cart) => { fnInit.call(this, cart); });
    this.user.getCities().then((res) => {
      this.setCities(res.meta.content);
    });
  }

  initPLP (response) {
    this.productsListingModel.response = response;
    this.params = Utils.getQueryParamsAsObject();
  }

  applyFacetFilters (event) {
    return this.router.navigate(event.detail.url);
  }

  scrollToReviews () {
    this.common.smoothScrollTo('#product-reviews-element', 172);
  }

  scrollToOtherSellers () {
    this.common.smoothScrollTo('#multiseller-element', 172);
  }

  scrollToSection (event) {
    this.common.smoothScrollTo(event.currentTarget.getAttribute('data-target'), 172);
  }  

  activate (params, routeConfig, navigationInstruction) {
    let fn = function () {
      this.common.pageType = this.response.type || this.common.pageType;
      this.customView = this.response.render && this.response.render.templateId;

      switch (this.response.type) {
        case 'detail': this.initPDP(this.response);
          // TODO - This is a hack. Remove once the API for meta.seo is fixed
          this.common.setMeta(this.response.meta, navigationInstruction.config.navModel, this.response.type, this.response.data.name);
          break;
        case 'list': this.initPLP(this.response);
          this.common.setMeta(this.response.meta, navigationInstruction.config.navModel);
          break;
        case 'static':
          this.common.setMeta(this.response.meta, navigationInstruction.config.navModel);
          break;
      }
    };

    if (this.common.firstLoad && this.common.loadAPIData) {
      this.response = this.common.loadAPIData;
      fn.call(this);
    } else {
      return this.request.backend(navigationInstruction.fragment + ((navigationInstruction.queryString) ? '?' + navigationInstruction.queryString : ''))
        .then((response) => {
          this.response = response;
          fn.call(this);
        });
    }
  }

  attached () {
    // FIXED CTAS DISPLAY ON MOBILE PDP
    if (this.common.ctx.device === 'mobile' && this.response.type === 'detail' && document.getElementById('pdp-static-cta-container')) {
      let staticCtaPosition = Utils.getOffset(document.getElementById('pdp-static-cta-container')).top;
      let checkStaticCtaPosition = Utils.debounce(function() {
        if (document.getElementById('pdp-fixed-cta-container')) {
          if (document.getElementsByTagName('body')[0].scrollTop > staticCtaPosition) {
            document.getElementById('pdp-fixed-cta-container').classList.add('show')
          }
          else {
            document.getElementById('pdp-fixed-cta-container').classList.remove('show')
          }
        }
      }, 150);
      window.addEventListener('scroll', checkStaticCtaPosition, { passive: true });
    }

    // SCROLL TO FIX PDP SUPPORT BAR
    let pdpDetailsNav = document.getElementById('pdp-details-nav');
    if (this.common.ctx.device === 'desktop' && this.response.type === 'detail' && pdpDetailsNav) {
      let pdpDetailsNavPosition = Utils.getOffset(pdpDetailsNav).top - pdpDetailsNav.offsetHeight;
      let spyscrollSection = document.querySelectorAll('.pdp-spyscroll-section');
      let spyscrollSections = {};
      let i = 0;

      Array.prototype.forEach.call(spyscrollSection, function(e) {
        spyscrollSections[e.id] = e.offsetTop - pdpDetailsNav.offsetHeight;
      });

      let checkpdpDetailsNavPosition = Utils.throttle(function() {
        let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollPosition > pdpDetailsNavPosition) {
          pdpDetailsNav.classList.add('fixed')

          for (i in spyscrollSections) {
            if (spyscrollSections[i] <= scrollPosition) {
              document.querySelector('.pdp-details-nav-item.active') && document.querySelector('.pdp-details-nav-item.active').classList.remove('active');
              document.querySelector('a[data-target*=' + i + ']') && document.querySelector('a[data-target*=' + i + ']').classList.add('active');
            }
          }
        }
        else {
          pdpDetailsNav.classList.remove('fixed');
        }
      }, 10);

      // CHECK IS THE NAV IS ACTUALLY EVEN NEEDED
      if (document.querySelectorAll('.pdp-details-nav-item').length <= 1) {
        document.getElementById('pdp-details-nav').parentNode.classList.add('hidden');
      }
      else {
        document.querySelectorAll('.pdp-details-nav-item')[0].classList.add('active');
        window.addEventListener('scroll', checkpdpDetailsNavPosition, { passive: true });
      }
    }
  }

  loadMoreProducts (event) {
    let url = window.location.pathname + window.location.search;
    url = url.indexOf('?') >= 0 ?
          [url.slice(0, url.indexOf('?') + 1) + 'page=' + (++event.detail.pageNo) + '&' + url.slice(url.indexOf('?') + 1)].join('') :
          url + '?page=' + (++event.detail.pageNo);
    let fn = function (event) {
      return this.request.backend(url).then((response) => {
        this.productsListingModel.response.data = event.detail.listing.concat(response.data);
        event.target.set('listing', this.productsListingModel.response.data);
        event.target.set('pageNo', event.detail.pageNo);
        event.target.set('alreadyLoading', false);
      });
    };
    
    fn.call(this, event);
  }

  loadExpertReviews (event) {
    let fn = function (event) {
      return this.request.backendCORS(this.expertReviewUrl).then((data) => {
        this.expertReviews = (event.detail.list) ? event.detail.list.concat(data.reviews) : data.reviews;
        this.expertReviewUrl = data.next_page_url;
      });
    };
    fn.call(this, event);
  }

  loadUserReviews (event) {
    let fn = function (event) {
      return this.request.backendCORS(this.userReviewUrl).then((data) => {
        this.userReviews = (event.detail.list) ? event.detail.list.concat(data.reviews) : data.reviews;
        this.userReviewUrl = data.next_page_url;
      });
    };
    fn.call(this, event);
  }

  sizeSelected (event) {
    let fn = function (event) {
      this.cart.log().then((cart) => {
        let sku = event.detail.sku;
        this.selectedSKU = sku;
        this.selectedSimple = this.productsModel.product.simples.find(function (d) { return d.sku === sku; });

        if (!cart.items[sku]) {
          this.productAlreadyInCart = false;
          this.defaultProduct = this.productsModel.addToCartProduct(sku);
        } else {
          this.productAlreadyInCart = this.selectedSKU === this.selectedSimple.sku;
        }
      })
    };
    fn.call(this, event);
  }

  redirectBuyNow () {
    return this.router.navigateToRoute(this.config.cart.buyNowRedirect);
  }

  getViewStrategy () {
    if (this.customView) {
      this.json = Helpers.initAsyncRender(this.response.render);
      this.common.bodyClass = this.response.render.overridingCSS || this.common.bodyClass;

      if (this.response.render.templateString) {
        return new InlineViewStrategy(this.response.render.templateString);
      }
    }

    switch (this.response.type) {
      case 'detail':
        return this.config.templateURL + 'modules/pdp' + this.config.moduleVersion + '.html';
      case 'list':
        return this.config.templateURL + 'modules/plp' + this.config.moduleVersion + '.html';
      default: this.common.pageType = '404';
        return this.config.templateURL + 'modules/404' + this.config.moduleVersion + '.html';
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

  getPromise (event) {

    let { sku_simple, vendor_code, destination } = event.detail;

    let request = {
      catalog_simple: [],
      destination,
      shop: this.config.locale.country
    };

    request.catalog_simple.push({
      sku_simple, vendor_code
    });

    return this.request.getPromise(request)
      .then((res) => {
        if (res.data && res.data.catalog_simple) {
          for (let simple in res.data.catalog_simple) {
            this.selectedSimple.suppliers.map(
              (item) => {
                if (item.sku === simple) {
                  item.delivery_info = res.data.catalog_simple[simple].expected_delivery_text;
                }
              }
            );
          }
        }
        if (event.target) {
          event.target.showChangeCity = false;
        }
      });
  }

  determineActivationStrategy () {
    return activationStrategy.replace;
  }
}
