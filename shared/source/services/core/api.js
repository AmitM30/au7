
import { inject }               from 'aurelia-framework';
import { HttpClient as FetchClient }   from 'aurelia-fetch-client';
import { HttpClient  }          from 'aurelia-http-client';
import { EventAggregator }      from 'aurelia-event-aggregator';

import { Common }               from '../common';
import { Config }               from '../config';
import { Utils }                from '../../misc/utils';

/**
 * The API service is single point of communication
 * with backend services
 */
@inject(Common, FetchClient, HttpClient, Config, EventAggregator)
export class API {

  constructor (common, fetch, http, config, ea) {
    fetch.configure((configuration) => {
      configuration.useStandardConfiguration()
        .withDefaults({
          headers: {
            'Accept': 'application/json'
          }
        })
        // .useStandardConfiguration()
        .withInterceptor({
          // request(request) {
            // console.log(`Requesting ${request.method} ${request.url}`);
            // ea.publish('Unhandled-Error', request);
            // return request; // you can return a modified Request, or you can short-circuit the request by returning a Response
          // },
          // response (response) {
          //   // console.log(`Received ${response.status} ${response.url}`, response);
          //   if (response.status !== 200 && response.status !== 201 && (response.url.indexOf('app/error') < 0)) {
          //     ea.publish('Unhandled-Error', { type: 'Interceptor', url: response.url, status: response.status, statusText: response.statusText });
          //   }
          //   return response;
          // }
        });
    });
    this.http = fetch;

    http.configure((config) => {});
    this.cors = http;

    this.common = common;
    this.config = config;
  }

  // TODO - Update default configuraion
  getDefaultHeaders () {
    return {
      'Accept': 'application/json',
      'N-Platform': this.config.platform,
      'N-Device': this.common.ctx.device,
      'N-Locale': this.common.ctx.lang + '_' + this.common.ctx.country.toUpperCase(),
      'N-Context': this.config.site,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Executes a GET request against the specified
   * endpoint, returning a promise of this action.
   *
   * @param {string} endpoint request url
   * @param {Object} [queryParameters] request params
   * @param {Object} [parameters] other params, like header
   * @param {Object} [noHeaders] request without default headers
   * @returns {Promise} returns a promise
   */
  getRequest (endpoint, queryParameters, parameters, noHeaders) {
    let options = {
      method: 'GET'
    }

    if (!noHeaders) {
      let headers = this.getDefaultHeaders();
        if (parameters) {
          for (let header in parameters) {
            if (parameters.hasOwnProperty(header)) {
              headers[header] = parameters[header];
            }
          }
        }
        
      options.headers = headers;
    }

    console.log('GET: ', 'https://en-sa.wadi.com' + endpoint + Utils.jsonToQueryString(queryParameters));
    return this.http.fetch('https://en-sa.wadi.com' + endpoint + Utils.jsonToQueryString(queryParameters), options);
  }

  /**
   * Executes a POST request against the specified
   * endpoint, returning a promise of this action.
   *
   * @param {string} [endpoint] request url
   * @param {Object} [data] payload data
   * @param {Object} [parameters] other params, like headers
   * @returns {Promise} returns a promise
   */
  postRequest (endpoint, data, parameters) {
    return this.http.fetch('https://en-sa.wadi.com' + endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: this.getDefaultHeaders()
    });
  }

  /**
   * Executes a PUT request against the specified
   * endpoint, returning a promise of this action.
   *
   * @param {string} [endpoint] request url
   * @param {Object} [data] payload data
   * @param {Object} [parameters] other params, like headers
   * @returns {Promise} returns a promise
   */
  putRequest (endpoint, data, parameters) {
    return this.http.fetch('https://en-sa.wadi.com' + endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: this.getDefaultHeaders()
    });
  }

  /**
   * Executes a POST Form data request against the specified
   * endpoint, returning a promise of this action.
   *
   * @param {string} [endpoint] request url
   * @param {Object} [data] payload data
   * @param {Object} [parameters] other params, like headers
   * @returns {Promise} returns a promise
   */
  postFormData (endpoint, formData, parameters) {
    let form = new FormData();
    form.append('file', formData.file);
    form.append('token', formData.token);
    let defaultHeaders = this.getDefaultHeaders();
    delete defaultHeaders['Content-Type'];
    return this.http.fetch('https://en-sa.wadi.com' + endpoint, {
      method: 'POST',
      body: form,
      headers: defaultHeaders
    });
  }

  /**
   * Executes a CORS GET request against the specified
   * endpoint, returning a promise of this action.
   *
   * @param {string} endpoint request url
   * @param {Object} [queryParameters] request params
   * @param {Object} [parameters] other params, like header
   * @returns {Promise} returns a promise
   */
  getCORSRequest (endpoint, queryParameters, parameters) {
    console.log('GET CORS: ', endpoint + Utils.jsonToQueryString(queryParameters));
    return this.cors.jsonp('https://' + endpoint + Utils.jsonToQueryString(queryParameters), 'callback')
      .then((httpResponse) => {
        return httpResponse.response;
      }, (error) => {
        return error.response;
      });
  }

  /**
   * Executes a DELETE request against the specified
   * endpoint, returning a promise of this action.
   *
   * @param {string} [endpoint] request url
   * @param {Object} [data] payload data
   * @param {Object} [parameters] other params, like headers
   * @returns {Promise} returns a promise
   */
  deleteRequest (endpoint, data, parameters) {
    return this.http.fetch('https://en-sa.wadi.com' + endpoint, {
      method: 'DELETE',
      headers: this.getDefaultHeaders()
    });
  }
}
