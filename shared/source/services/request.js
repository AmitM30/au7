
import { inject }               from 'aurelia-framework';

import { API }                  from './core/api';
import { Config }               from './config';
import { CartModel }            from '../models/cart-model';

/**
 * The Api service is single point of communication
 * with backend services
 */
@inject(API, Config, CartModel)
export class Request {

  constructor (api, config, cartModel) {
    this.api = api;
    this.config = config;
    this.cartModel = cartModel;
  }

  /**
   * Executes a GET request for search results
   *
   * @param {string} key search string
   * @returns {Promise} search result
   */
  search (key) {
    return this.api.getRequest(this.config.apis.search, { q: key })
      .then((response) => response.json(), (err) => err.json());
  }

  /**
   * Executes a GET request for suggest results
   *
   * @param {string} key suggest string
   * @returns {Promise} suggest result
   */
  suggest (key) {
    return this.api.getRequest(this.config.apis.suggest, { q: key })
      .then((response) => response.json(), (err) => err.json());
  }

  /**
   * Executes a GET request for fetching the navigation
   *
   * @returns {Promise} suggest result
   */
  navigation () {
    return this.api.getRequest(this.config.apis.navigation)
      .then((response) => response.json(), (err) => err.json());
  }

  /**
   * Executes a GET request for fetching the factes list configuration
   *
   * @returns {Promise} suggest result
   */
  facetsList () {
    return this.api.getRequest(this.config.apis.facets)
      .then((response) => response.json(), (err) => err.json());
  }

  /**
   * Executes a GET request for fetching the all categories for search
   *
   * @returns {Promise} super cat and cat
   */
  getCategories () {
    return this.api.getRequest(this.config.apis.categories)
      .then((response) => response.json(), (err) => err.json());
  }

  /**
   * Executes a GET request for newsletter signup
   *
   * @param {string} customer customer object
   * @returns {Promise} 201 status code
   */
  newsletterSignUp (customer) {
    let data = {
      gender: customer.gender,
      email: customer.email,
      firstName: 'Wadi',
      lastName: 'Customer',
      language : this.config.locale.lang,
      country: this.config.locale.country,
      utm_campaign: 'signup',
      utm_source: 'DIRECT'
    }

    return this.api.postRequest(this.config.apis.subscribe, data)
      .then((response) => response.json(), (err) => err.json());
  }

  /**
   * Executes a GET request for tracking an order
   *
   * @param {string} orderNo and email
   * @returns {Promise} track order result
   */
  trackOrder(orderNo, email) {
    return this.api.getRequest("https://track.wadi.com/token", {order_nr: orderNo, email: email}, null, true)
      .then((response) => response.json(), (err) => err.json());
  }

  /**
   * Executes a POST request for campaign signup
   *
   * @param {string} user user object
   * @returns {Promise} 201 status code
   */
  promotionSignup (campaign) {
    let data = {
      email: campaign.email,
      promotionType: campaign.type,
      countryCode: this.config.locale.country,
      languageCode: this.config.locale.lang,
      phone : campaign.phone,
      utm_source: 'DIRECT'
    }

    return this.api.postRequest(this.config.apis.promotion, data)
      .then((response) => response.json(), (err) => err.json());
  }

  /**
   * Executes a GET request for product information
   *
   * @param {string} url product url
   * @returns {Promise} product data
   */
  backend (url, headers = {}) {

    if (this.cartModel.addresses && this.cartModel.addresses.shipping && this.cartModel.addresses.shipping.city) {
      headers.city = this.cartModel.addresses.shipping.city;
    }

    return this.api.getRequest(this.config.apis.backend + (url || ''), null, headers)
      .then((response) => response.json(), (err) => err.json());
  }

  /**
   * Executes a GET request
   *
   * @param {string} url product url
   * @returns {Promise} 
   */  
  baseApiRequest (url) {
    return this.api.getRequest(this.config.apis.apiBase + url)
    .then((response) => response.json(), (err) => err.json());
  }

  /**
   * Executes a GET CORS request for given url
   *
   * @param {string} url url to make call
   * @param {object} query query params as JSON object
   * @returns {Promise} response data
   */
  backendCORS (url, query) {
    return this.api.getCORSRequest(url, query);
  }

  /**
   * Executes a GET request for product information
   *
   * @param {string} sku product sku
   * @returns {Promise} product data
   */
  product (sku, headers = {}) {
    
    if (this.cartModel.addresses && this.cartModel.addresses.shipping && this.cartModel.addresses.shipping.city) {
      headers.city = this.cartModel.addresses.shipping.city;
    }

    return this.api.getRequest(this.config.apis.product + sku, null, headers)
      .then((response) => response.json(), (err) => err.json());
  }

  /**
   * Executes a GET CORS request for product review
   *
   * @param {string} sku product sku
   * @returns {Promise} product review data
   */
  reviews (query) {
    return this.api.getCORSRequest(this.config.apis.reviews, query);
  }

  /**
   * Delivery promises
   * 
   */
  getPromise (data) {
    return this.api.postRequest(this.config.apis.promise, data)
      .then((response) => response.json(), (err) => err.json());
  }

  /**
   * Executes a POST request to log app error to server
   *
   * @param {object} data error object
   * @returns {Promise} response
   */
  error (data) {
    return this.api.postRequest(this.config.apis.error, data);
  }
}
