
import { inject }               from 'aurelia-framework';
import { InlineViewStrategy }   from 'aurelia-framework';
import { setUpFramework7 }      from './f7.js'

import { Settings }             from './config/settings';
import { Cart }                 from '../shared/source/services/cart';
import { Listener }             from '../shared/source/services/listener';
import { Notifier }             from '../shared/source/services/notifier';
import { Messenger }            from '../shared/source/services/messenger';
import { Lazyload }             from '../shared/source/services/lazyload';
import { Translation }          from '../shared/source/services/translation';
import { Tracking }             from '../shared/source/services/tracking';
import { Common }               from '../shared/source/services/common';
import { Request }              from '../shared/source/services/request';
import { Tsaheylu }             from '../shared/source/services/crosstalk';
import { User }                 from '../shared/source/services/user';
import { AppWrapper }           from '../shared/source/services/app-wrapper';
import { UnhandledError }       from '../shared/source/services/unhandled-error'
import { ProductListingModel }  from '../shared/source/models/product-listing';
import { TsaheyluModel }        from '../shared/source/models/crosstalk';
import { CartModel }            from '../shared/source/models/cart-model';
import { PreRenderStep }        from '../shared/source/lib/preRenderStep';
import { PostCompleteStep }     from '../shared/source/lib/postCompleteStep';
import { Review }               from '../shared/source/services/review';
import { ServiceWorker }        from '../shared/source/services/worker';

@inject(Common, Request, Review, User, Settings, Cart, Notifier, Messenger, Listener, Lazyload, ProductListingModel, TsaheyluModel, Tsaheylu, UnhandledError, Tracking, AppWrapper, CartModel, Translation, ServiceWorker)
export class App {

  suggest = {};

  constructor (common, request, review, user, config, cart, notifier, messenger, listener, lazyload, plpModel, tsaheyluModel, tsaheylu, unhandled, tracking, appWrapper, cartModel) {
    this.common = common;
    this.request = request;
    this.user = user;
    this.config = config;
    this.cart = cart;
    this.review = review;
    this.notifier = notifier;
    this.plpModel = plpModel;
    this.lazyload = lazyload;
    this.tracking = tracking;
    this.tsaheylu = tsaheylu;
    this.tsaheyluModel = tsaheyluModel;
    this.unhandled = unhandled;
    this.appWrapper = appWrapper;
    this.cartModel = cartModel;
  }

  configureRouter (config, router) {
    let appDir = (window.appDirectory || '').replace('file:///', '');
    console.log('appDir: ', appDir);
    config.addPipelineStep('preRender', PreRenderStep);
    config.addPipelineStep('postcomplete', PostCompleteStep);
    config.map([
      { route: ['', 'home', appDir + 'index.html'],    name: 'home',         moduleId: '../shared/source/modules/home',     nav: true },
      { route: 'cart',          name: 'cart',         moduleId: '../shared/source/modules/cart',     nav: true,  title: 'Cart' },
      { route: 'checkout',      name: 'checkout',     moduleId: '../shared/source/modules/checkout', nav: true,  title: 'Checkout'},
      { route: 'something-went-wrong', name: 'error', moduleId: '../shared/source/modules/error',    nav: false, title: 'What went Wrong !' }
    ]);
    config.mapUnknownRoutes('../shared/source/modules/handler');
    config.fallbackRoute('/');

    // Pretty URLs - No /#/
    config.options.pushState = true;
    config.options.hashChange = false;

    this.router = router;
  }

  async activate () {
    
    // Fetch facets list
    // this.request.facetsList().then((list) => { this.config.set('facetTypes', list.data || this.config.facetTypes); });
    
    // Set cart count
    // this.common.cartCount = await this.cart.length();
    
    this.cartModel.addresses.shipping = this.cartModel.addresses.shipping || this.cartModel.getDefaultAddressObject();
    this.cartModel.addresses.billing = this.cartModel.addresses.billing || this.cartModel.getDefaultAddressObject();
    
    await this.appWrapper.init();
    // Set user status
    await this.user.status();

    this.lazyload.init();

  }

  search (event) {
    if (event.detail.keyCode === 13) {
      this.directSearch(event);
    }

    let fn = (event) => {
      this.request.suggest(event.detail.term).then((response) => {
          this.suggest = response;
          event.detail.ref.set('searchSuggestLoading', false);
        });
    };

    fn.call(this, event);
  }

  directSearch (event) {
    this.router.navigate('/catalog?q=' + event.detail.term);
  }

  loginUser (event) {
    this.user.login({ username: event.detail.email, password: event.detail.password }).then((response) => {
        if (!response.isLoggedIn) {
          this.notifier.setMessage(window.translate.messaging(response.message));
        }
      });
  }

  logoutUser () {
    this.user.logout();
  }

  socialLogin (event) {
    event.stopPropagation();
    this.user.socialLogin({ provider: event.detail.provider, token: event.detail.token });
  }

  guestLogin (event) {
    event.stopPropagation();
    this.user.guestLogin(event.detail);
  }

  otpRequest (event) {
    this.event = event.target;
    this.user.sendOTP(event.detail).then((response) =>{
      if (!response.success) {
        this.event.set('otpError', false);
      } else if (response.phoneVerified) {
        this.event.set('otpVerified', true);
        this.user.info.primaryPhone = this.event.phoneNumber;
        this.user.savePrimaryPhone({number: this.event.phoneNumber, isPrimary: true, verified: true});
      }
    });
  }

  otpVerify (event) {
    this.event = event.target;
    this.user.verifyOTP(event.detail).then((response) =>{
      if (!response.success) {
        this.event.set('otpError', true);
      } else if (response.phoneVerified) {
        this.event.set('otpVerified', true);
        this.user.info.primaryPhone = this.event.phoneNumber;
        this.user.savePrimaryPhone({number: this.event.phoneNumber, isPrimary: true, verified: true});
      }
    });
  }

  skipPhoneVerification (event) {
    this.user.info.primaryPhone = event.detail.phone;
  }

  checkUserExistence (event) {
    event.stopPropagation();
    return this.user.checkUserExistence(event.detail.email).then((res) => {
      if (res.success) {
        event.target.isNewCustomer = false;
      } else {
        event.target.isNewCustomer = true;
      }
      event.target.proceedingWithEmail = true;
    });
  }

  passwordResetRequest (event) {
    event.stopPropagation();
    this.user.passwordResetRequestV2(event.detail).then((response) => {
        if (response.success) {
          event.target.passResetRequestSent = true;
          this.notifier.setMessage(window.translate.messaging(response.message));
        }
      });
  }

  setPassword (event) {
    event.stopPropagation();
    this.user.passwordResetV2(event.detail).then((response) => {
        if (!response.isLoggedIn) {
          this.notifier.setMessage(window.translate.messaging(response.message));
        }
      });
  }

  addToCart (event) {
    this.detail = event.detail;

    let success = function (cart) {
      if (this.detail.redirect) {
        this.router.navigateToRoute(this.config.cart.buyNowRedirect);
      } else {
        let _self = this; // Safari hack
        window.setTimeout(function () {
          _self.detail.ref.set('addCartText', window.translate('Go To Cart'));
          _self.detail.ref.set('buttonProgressClass', '');
          _self.detail.ref.className = 'full-width';
          _self.detail.ref.set('inCart', true);
          _self.smoothScrollToTop();
          _self.cartCounterClass = 'expand';
          window.setTimeout(function () { _self.cartCounterClass = ''; }, 1000);
        }, 800);
      }

      this.cart.count().then((len) => { this.common.cartCount = len; });
      return this.orderCheck();
    };

    // GO TO CART BUTTON
    if (this.detail.inCart) {
      this.router.navigateToRoute(this.config.cart.buyNowRedirect);
      return;
    }

    this.cart.add(this.detail.item.sku, this.detail.item.vendor, this.detail.item.price).then((cart) => { success.call(this, cart); });
  }

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
    });
  }

  loadCarouselProducts (event) {
    let fn = function (event) {
      return this.request.backend(event.detail.url).then((response) => {
        event.detail.ref.set('products', response.data || []);
      });
    };
    fn.call(this, event);
  }

  baseApiRequest (event) {
    let fn = function (event) {
      return this.request.baseApiRequest(event.detail.url).then((response) => {
        event.detail.ref.set('products', response.data || []);
      });
    };
    fn.call(this, event);
  }

  getUSPs() {
    return this.config.usps.usps[this.common.ctx.lang].data;
  }

  newsletterSignUp (event) {
    let fn = (ref) => {
      this.user.signUp(this.common.newsletterCustomer).then((response) => {
        if (response.success) {
          ref.set('subscriptionSuccessful', true);
        } else {
          ref.set('alreadySubscribed', true);
        }
      }).catch((error) => {
        ref.set('subscriptionUnsuccessful', true);
      });
    };

    fn.call(this, event.detail.ref);
  }

  campaignSignup (event) {
    this.request.promotionSignup(event.detail).then((res) => {
        event.detail.ref.set('response', { success: res.is_new });
      }).catch((error) => {
        event.detail.ref.set('response', { success: false });
      });
  }

  attached () {
    setUpFramework7('#wadi');

    // Set locale cookie
    this.common.setLocaleCookie();

    // Request navigation
    this.request.navigation().then((nav) => { this.nav = nav.data.mapping; });

    this.review.getCartData();

    // TODO - Convert to Global Event Class
    window.addEventListener('redirect-buy-now', (event) => { this.router.navigateToRoute(this.config.cart.buyNowRedirect); });
    window.addEventListener('redirect', (event) => { this.router.navigate(event.detail.url); });

    // Clear the loading screen timeout function
    window.clearTimeout(window.loadingAnimation);

    // Init route change visual cue
    this.initRouteChangeCue();

    // Set UTM params
    this.tracking.init();
  }

  getViewStrategy () {
    return this.config.templateURL + 'app.html';
  }

  determineActivationStrategy () {
    return activationStrategy.replace;
  }

  initRouteChangeCue () {
    let cueEl = document.querySelector('#route-loader');
    let previousRoute;

    this.router.events.subscribe('router:navigation:processing', (navigationInstruction) => {
      previousRoute = previousRoute || window.location.href;
      if (this.common.firstLoad) { return; }
      cueEl.classList.add('started');
      window.setTimeout(() => { cueEl.classList.add('in-progress'); }, 200);
    });

    this.router.events.subscribe('router:navigation:success', (navInstructions) => {
      // Since aurelia deletes previousInstructions before route activates
      window.previousRoute = previousRoute || window.location.href;
      previousRoute = window.location.href;
      if (this.common.firstLoad) { return; }
      if (/^\/checkout$/.test(navInstructions.instruction.fragment)) {
        let checkoutNowEvent = new Event("checkout-now", {"bubbles":true, "cancelable":false});
        window.document.dispatchEvent(checkoutNowEvent);
      }
      window.setTimeout(() => { cueEl.classList.add('in-progress'); }, 200);
    });

    this.router.events.subscribe('router:navigation:complete', () => {
      if (this.common.firstLoad) { this.common.firstLoad = false; return; }
      window.setTimeout(() => {
        window.setTimeout(() => { cueEl.classList.remove('started'); cueEl.classList.remove('in-progress'); cueEl.classList.remove('complete'); }, 300);
        cueEl.classList.add('complete');
      }, 500);
    });

    // Something went wrong
    this.router.events.subscribe('router:navigation:error', (e) => {
      cueEl.classList.add('in-progress');

      // let error = this.router.routes.find((x) => { return x.name === 'error' });
      let error = { error: e };

      if (document.referrer) {
        error.referrer = { domain: document.referrer }
      }

      this.notifier.setMessage(window.translate('An error occurred. Please try again.'));
      this.unhandled.navigatingError(error);
      // this.router.navigateToRoute('error');
    });
  }

  handleLoader () {
    let initVal = 70;
    // window.setLoaderWidth(initVal);
    let el = document.getElementById('index-route-loader');
    if (el) {
      document.getElementById('index-route-loader').className = 'in-progress';
      window.loaderEvent = window.setInterval(() => {
        if (initVal >= 100) { window.clearInterval(window.loaderEvent); }
        window.setLoaderWidth(++initVal);
      }, 400);
    }
  }

  smoothScrollToTop () {
    this.common.smoothScrollTo('header');
  }  

  /**
   * @desc Get formatted recommendations object for MSD
   * 
   * @param {String} sku 
   * @param {Number} widgetId 
   * @param {String} title 
   * @param {Boolean} hidePagination 
   * @param {Object} sliderOptions 
   * 
   * @return {Object}
   */

  getRecommendationsObject (sku, widgetId, title, hidePagination =  true,  baseApi = true, sliderOptions = { 'slidesPerView': 2 }) {
    
    let obj =  {
      'hidePrevNext': true,
      'url': `/recommendations/?sku=${sku}&widgets=${widgetId}`,
      'title': `${window.translate(title)}`,
      'hidePagination': hidePagination,
      'sliderOptions': sliderOptions,
      'baseApi': baseApi
    };

    return obj;
  }

  detached () {
    // document.removeEventListener('addProduct');
    // this.subscriber.dispose();
  }
}
