
import { inject }               from 'aurelia-framework';
import { EventAggregator }      from 'aurelia-event-aggregator';
import { Router }               from 'aurelia-router';

import { Utils }                from '../misc/utils';

// TODO - Not used as of now - under POC
let imgLoad = function (url) {
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'blob';

    request.onload = () => {
      if (request.status === 200) {
        resolve(request.response);
      } else {
        reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
      }
    };

    request.onerror = () => {
      reject(Error('There was a network error.'));
    };

    request.send();
  });
};

@inject(EventAggregator, Router)
export class Lazyload {

  constructor (ea, router) {
    this.ea = ea;
    this.events = router.events;

    // this.activate();
  }

  lazyLoad (source) {
    this.lazyLoadImages(source);
    Utils.debounce(this.lazyLoadCarousels(source), 200);
  }

  lazyLoadImages (source) {
    let images;

    // If we get a source from element that fired the event
    // we can check to lazyload images only from that element's children
    if (source && source.detail && (source.detail instanceof Element || (source.detail.nodeType && source.detail.nodeType === 1))) {
      images = source.detail.querySelectorAll('body img[lazy-src]');
    } else {
      images = document.querySelectorAll('body img[lazy-src]');
    }

    // load images that have entered the viewport
    [].forEach.call(images, function (item) {
      let rect = item.getBoundingClientRect();
      if (rect.top >= (0 - window.innerHeight) &&
        rect.left >= 0 &&
        rect.top <= ((window.innerHeight || document.documentElement.clientHeight) + window.innerHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)) {
        item.setAttribute('src', item.getAttribute('lazy-src'));
        item.removeAttribute('lazy-src');
        item.onload = function () { item.classList.add('loaded'); };

        // let myImage = new Image();
        // let imgSrc = item.getAttribute('lazy-src');
        // item.removeAttribute('lazy-src');
        // imgLoad(imgSrc).then((response) => {
        //   let imageURL = window.URL.createObjectURL(response);
        //   item.setAttribute('src', imageURL);
        //   item.classList.add('loaded');
        // }, (e) => { console.log(e); });
      }
    });
  }

  lazyLoadCarousels (source) {
    let carousels = document.querySelectorAll('products-carousel-element');

    // load images that have entered the viewport
    [].forEach.call(carousels, function (item) {
      let rect = item.getBoundingClientRect();
      if (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.top <= ((window.innerHeight || document.documentElement.clientHeight) + window.innerHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)) {
          item.isNearViewPort = true;
      }
    });
  }

  init () {
    window.addEventListener('load', this.lazyLoad.bind(this));
    window.addEventListener('resize', this.lazyLoadImages, { passive: true });
    window.addEventListener('scroll', this.lazyLoad.bind(this), { passive: true });
    window.addEventListener('lazy-load-images', this.lazyLoadImages);
    this.ea.subscribe('lazy-load-images', this.lazyLoadImages);
    this.events.subscribe('router:navigation:complete', this.lazyLoadImages);
    this.events.subscribe('router:navigation:complete', this.lazyLoad.bind(this));
    window.addEventListener('animation:enter:done', this.lazyLoad.bind(this));

    this.lazyLoadImages();
  }
}
