
import { inject }               from 'aurelia-framework';

import { Config }               from './config';

@inject(Config)
export class SEO {

  constructor (config) {
    let DEFAULT_SEO = config.meta;

    this.domain = config.domain;
    this.country = config.locale.country;
    this.lang = config.locale.lang;

    this.fullCountryName = config.countries[this.country].name[this.lang];
    this.pdpSEO = config.meta.pdp[this.lang];

    this.getDefault = function () {
      return DEFAULT_SEO;
    }

    // this.activate();
  }

  setMeta (data, navModel, pageType, productName) {
    let fn = function (target, src) {
      let dest = {};

      if (target && typeof target === 'object') {
        Object.keys(target).forEach(function (key) {
          if (target[key]) {
            dest[key] = target[key];
          }
        })
      }

      Object.keys(src).forEach(function (key) {
        if (typeof src[key] !== 'object' || !src[key]) {
          dest[key] = (src[key]) ? src[key] : target[key];
        }
        else {
          if (!target[key]) {
            dest[key] = src[key];
          } else {
            dest[key] = fn(target[key], src[key]);
          }
        }
      });

      return dest;
    };

    // Set Page Title
    let obj = fn(this.getDefault(), data);

    if (pageType === 'detail' && productName) {
      navModel.title = this.pdpSEO.seo.pageTitle.replace(/\[ProductName]/g, productName).replace(/\[CountryName]/g, this.fullCountryName);
      document.querySelector('meta[name=description]').setAttribute('content', this.pdpSEO.seo.metaDescription.replace(/\[ProductName]/g, productName).replace(/\[CountryName]/g, this.fullCountryName));
    } else {
      navModel.title = obj.content.pageTitle || obj.seo.pageTitle;
      document.querySelector('meta[name=description]').setAttribute('content', obj.content.metaDescription || obj.seo.metaDescription);
    }

    let validUrl = 'https://' + this.lang + '-' + this.country + '.' + this.domain + window.location.pathname;
    document.querySelector('link[rel=canonical]').setAttribute('href', validUrl);

    // Google Localization
    [].forEach.call(document.querySelectorAll('link[rel=alternate]'), (div) => {
      div.setAttribute('href', 'https://' + div.getAttribute('hreflang') + '.' + this.domain + window.location.pathname);
    });

    // Bing Localization
    document.querySelector('meta[http-equiv=content-language]').setAttribute('content', this.lang + '-' + this.country);

    // Add Search Schema
    // if (navModel.config.name === 'home') {
    //   let tag = document.createElement('script');
    //   tag.type = 'application/ld+json';
    //   let subDomain = this.lang + '-' + this.country;
    //   tag.textContent = '{"@context": "http://schema.org","@type": "WebSite","url": "https://' + subDomain + '.wadi.com","potentialAction": {"@type": "SearchAction","target": "https://' + subDomain + '.wadi.com/catalog/?q={search_term_string} ","query-input": "required name=search_term_string"}}'
    //   document.querySelector('head').appendChild(tag);
    // }
  }

  activate () {
    console.log('Activate: SEO');
  }
}
