
export class ServiceWorker {

  constructor () {
    let fn = function () {
      if ('serviceWorker' in window.navigator) {
        window.navigator.serviceWorker.register('/dist/ext/sw.js', { scope: '/' }).then((reg) => {
          if (reg.installing) {
            console.info('Service worker installing');
          } else if (reg.waiting) {
            console.info('Service worker installed');
          } else if (reg.active) {
            console.info('Service worker active');
          }
        }).catch((error) => { console.info('Service Worker Registration failed with ' + error); });
      }
    }

    if ('serviceWorker' in navigator && navigator.userAgent.indexOf("Mobile") === -1) {
      window.setTimeout(fn, 10000)
    } else if ('serviceWorker' in navigator && navigator.userAgent.indexOf("Mobile") > -1) {
        navigator.serviceWorker.getRegistration().then(function (registration) {
            var serviceWorkerUnregistered = false;
            if (registration) {
                registration.unregister();
                serviceWorkerUnregistered = true;
            }
            serviceWorkerUnregistered && window.location.reload();
        });
    }
  }
}
