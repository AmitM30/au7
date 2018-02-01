
var self                      = this;
var internals                 = {};

internals.STATIC_CACHE_NAME   = 'static-v1';
internals.API_CACHE_NAME      = 'api-v1';
internals.SUGGEST_CACHE_NAME  = 'suggest-v1';

internals.LRUCache            = {};             // Object to maintain timestamp for request urls
internals.MAX_CACHE_SIZE      = 50;
internals.EXPIRE_CACHE_TIME   = 24 * 60 * 60 * 1000; // 24 Hours

internals.SUGGEST_CACHE_TIME  = 5 * 60 * 1000;  // 5 minutes
internals.API_CACHE_TIME      = 5 * 60 * 1000;  // 5 minutes

internals.CACHE_FILE_LIST = [
  // '/dist/fonts/wadicons.woff2?app=v2',
  // '/dist/fonts/proximanova-regular-webfont.woff2?app=v2',
  // '/dist/fonts/proximanova-semibold-webfont.woff2?app=v2',
  // 'z.wadicdn.com/components/elements.html',
  // 'z.wadicdn.com/dist/polymer.html',
  'z.wadicdn.com/components/pdp.html',
  'z.wadicdn.com/components/cart.html',
  'z.wadicdn.com/components/checkout.html',
  'z.wadicdn.com/modules/plp.html',
  'z.wadicdn.com/modules/pdp.html',
  'z.wadicdn.com/modules/cart.html',
  'z.wadicdn.com/modules/checkout.html',
  'z.wadicdn.com/modules/checkout/signin.html',
  'z.wadicdn.com/modules/checkout/shipping.html',
  'z.wadicdn.com/modules/checkout/payment.html',
  'z.wadicdn.com/modules/checkout/success.html',
  'z.wadicdn.com/modules/404.html'
  // 'z.wadicdn.com/wadi.bundle.js'

  // 'z.wadicdn.com/dist/styles/site.css',
  // 'z.wadicdn.com/dist/app-launch-v3.js',     // Cors issue on Safari
  // 'z.wadicdn.com/wadi.bundle.js',
  // 'z.wadicdn.com/dist/images/logo-en.png',
  // 'z.wadicdn.com/dist/images/logo-ar.png'
];

internals.CACHE_API_LIST = [
  // '/',
  // '/api/sawa/v1/facets/list',
  '/api/sawa/v1/config/navigation',
  // '/api/rose/u/_meta/areas',
  // '/api/rose/u/_meta/cities'
];

internals.SUGGEST_API_LIST = [
  '/api/sawa/v1/suggest',
  '/api/sawa/v1/suggest/'
];

// *********************************************************** LOGIC TO CACHE API **
internals.cacheAPIResponse = function (request) {
  var now = (new Date()).getTime();
  var url = new URL(request.url);
  return caches.match(request).then(function(response) {
    if (response) {
      if ((now - internals.LRUCache[url.pathname + url.search]) < internals.API_CACHE_TIME) {
        return response;
      }
    }

    return fetch(request).then(function(response) {
      internals.LRUCache[url.pathname + url.search] = now;
      caches.open(internals.API_CACHE_NAME).then(function(cache) {
        cache.put(request, response);
      });

      return response.clone();
    });
  });

  // if (request.headers.get('x-use-cache')) {
  //   // same logic as above
  // } else {
  //   return fetch(request).then(function(response) {
  //     return caches.open(internals.API_CACHE_NAME).then(function(cache) {
  //       cache.put(request, response.clone());
  //       return response;
  //     });
  //   });
  //   // caches.delete(internals.API_CACHE_NAME).then(function () {
  //   //   return caches.open(internals.API_CACHE_NAME);
  //   // }).then(function (contentCache) {
  //   //   contentCache.add(request);
  //   //   return fetch(request);
  //   // });
  // }
};

// *********************************************** LOGIC TO CACHE SUGGEST RESULTS **
internals.cacheSuggestResponse = function (request) {
  var now = (new Date()).getTime();
  var url = new URL(request.url);
  return caches.match(request).then(function(response) {
    if (response) {
      if ((now - internals.LRUCache[url.pathname + url.search]) < internals.SUGGEST_CACHE_TIME) {
        return response;
      }
    }

    return fetch(request).then(function(response) {
      // Clear Stale Cache
      if (Object.keys(internals.LRUCache).length > internals.MAX_CACHE_SIZE) {
        internals.sanitizeLRU();
      }

      internals.LRUCache[url.pathname + url.search] = now;
      caches.open(internals.SUGGEST_CACHE_NAME).then(function(cache) {
        cache.put(request, response);
      });

      return response.clone();
    });
  });
};

// ************************************************* LOGIC TO CACHE STATIC ASSETS **
internals.cacheStaticAssets = function (request) {
  return caches.match(request).then(function(response) {
    if (response && response.type !== 'opaque') {
      // console.log('cacheStaticAssets -> RESPOND FROM CACHE: ', request.url);
      return response;
    }

    return fetch(request).then(function(response) {
      caches.open(internals.STATIC_CACHE_NAME).then(function(cache) {
        cache.put(request, response);
      });

      // console.log('cacheStaticAssets -> RESPOND FROM NETWORK', request.url);
      return response.clone();
    });
  }).catch(function () {
    return caches.get(internals.STATIC_CACHE_NAME).then(function () {
      cache.add(request);
      // console.log('cacheStaticAssets -> RESPOND FROM CATCH', request.url);
      return fetch(request);
    });
  });

  // return caches.match(request).catch(function () {
  //   console.log('catch');
  //   return caches.get(internals.STATIC_CACHE_NAME).then(function () {
  //     cache.add(request);
  //     return fetch(request);
  //   });
  // });
};

// ************************************************************************ FETCH **
// Listen for all `fetch` event from the application
// response with cache first if in the list, else regular fetch
self.addEventListener('fetch', function(event) {
  var requestURL = new URL(event.request.url);

  if (internals.CACHE_API_LIST.indexOf(requestURL.pathname) >= 0) {
    event.respondWith(internals.cacheAPIResponse(event.request));
  } else if (internals.SUGGEST_API_LIST.indexOf(requestURL.pathname.split('?')[0]) >= 0) {
    event.respondWith(internals.cacheSuggestResponse(event.request));
  } else if ((internals.CACHE_FILE_LIST.indexOf(requestURL.pathname) >= 0)
          || (internals.CACHE_FILE_LIST.indexOf(requestURL.href) >= 0)) {
    event.respondWith(internals.cacheStaticAssets(event.request));
  }
  // Do not intercept unnecessary fetch requests
  // https://stackoverflow.com/questions/44106334/long-time-waiting-request-to-service-worker
  // else {
  //   // console.log('MAIN ELSE -> CALLED: ', requestURL.href);
  //   event.respondWith(fetch(event.request));
  // }

  // Older method
  // var response;
  // event.respondWith(
  //   caches.match(event.request).then(function(r) {
  //       console.log('r: ', r);
  //       response = r;
  //       // return from cache
  //       return response || fetch(event.request).then(function(response) {
  //         // cache the network response and then return
  //         cache.put(event.request, response);
  //         return response.clone();
  //       });
  //     }).catch(function() {
  //       console.log('Catch All');
  //       return fetch(event.request);
  //     // return caches.match('/sw-test/gallery/myLittleVader.jpg');
  //   })
  // );
});

// ********************************************************************** INSTALL **
// Place to instantiate the SW with pre-cached list of assets / endpoints
self.addEventListener('install', function(event) {
  event.waitUntil(
    Promise.all([
      caches.open(internals.STATIC_CACHE_NAME).then(function(cache) {
        return cache.addAll(internals.CACHE_FILE_LIST);
      }),
      caches.open(internals.API_CACHE_NAME).then(function(cache) {
        var now = (new Date()).getTime();
        internals.CACHE_API_LIST.forEach(function(api) { internals.LRUCache[api] = now; }, this);
        return cache.addAll(internals.CACHE_API_LIST);
      })
    ])
    .then(function () {
      // At this point everything has been cached

      // `skipWaiting()` forces the waiting ServiceWorker to become the
      // active ServiceWorker, triggering the `onactivate` event.
      // Together with `Clients.claim()` this allows a worker to take effect
      // immediately in the client(s).
      return self.skipWaiting();
    })

    // // On network response
    // event.respondWith(
    //   caches.open('v1').then(function(cache) {
    //     return cache.match(event.request).then(function (response) {
    //       return response || fetch(event.request).then(function(response) {
    //         cache.put(event.request, response.clone());
    //         return response;
    //       });
    //     });
    //   })
    // }).catch(function() {
    //   return caches.match('/sw-test/gallery/myLittleVader.jpg');
    // }));
  );
});

// ********************************************************************* ACTIVATE **
// Place to clean up old version of cache
// https://github.com/jakearchibald/trained-to-thrill/blob/master/src/js/sw/index.js
self.addEventListener('activate', function(event) {
  if (self.clients && clients.claim) {
    clients.claim();
  }

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      Promise.all(
        [
          cacheNames.map(function(cacheName) {
            if (internals.STATIC_CACHE_NAME !== cacheName && internals.API_CACHE_NAME !== cacheName) {
              return caches.delete(cacheName);
            }
          })
        ]
      );
    })
  );
});

// LRU Cache clear
internals.sanitizeLRU = function () {
  var now = (new Date()).getTime();
  Object.keys(internals.LRUCache).map(function (key) {
    if ((now - internals.LRUCache[key]) > internals.EXPIRE_CACHE_TIME) {
      delete internals.LRUCache[key];
    }
  });
};

// setInternval has issues in service workers
// internals.CACHE_EXPIRE_INTERVAL = 1 * 60 * 1000;
// self.setInterval(function () { internals.sanitizeLRU() }, internals.CACHE_EXPIRE_INTERVAL);


// TODO *****************************************
// 1. Separate cache box for assets, APIs and suggest - DONE
// 2. version the cache per deployment - DONE
// 3. Index page should not cache
// 4. API endpoint cache should expire at some time - DONE
// 5. Suggest endpoint cache should expire at session or some time - DONE
// 6. Implement - maxAgeSeconds - If network fails, serve from cache even after maxAgeSeconds
// 7. Implement - maxEntries
