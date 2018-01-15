
import { inject }               from 'aurelia-framework';
import { EventAggregator }      from 'aurelia-event-aggregator';

import { Request }              from './request';

const browserVersion = function () {
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
};

@inject(Request, EventAggregator)
export class UnhandledError {

  constructor (request, ea) {
    this.request = request;
    this.ea = ea;

    this.activate();
  }

  debug (logger, message, ...rest) {
    // console.debug(`DEBUG [${logger.id}] ${message}`, ...rest);
    // let msg = `${errorEvent.error.message} \r ${errorEvent.error.stack}`;
  }

  info (logger, message, ...rest) {
  }

  warn (logger, message, ...rest) {
  }

  error (logger, message, ...rest) {
    let referrer = window.location;
    // TODO - The error endpoint is not ported
    // this.request.error({
    //   type: 'Aurelia Error',
    //   id: logger.id,
    //   error: {
    //     message: message ? message.toString() : '',
    //     stack: message.stack
    //   },
    //   href: { host: referrer.host, pathname: referrer.pathname, search: referrer.search },
    //   meta: { platform: navigator.platform, vendor: navigator.vendor, userAgent: navigator.userAgent, browserVersion: browserVersion() }
    // }).then(() => {
    //   if (message && message.toString().indexOf('Router navigation failed') >= 0) {
    //     // window.location.replace('/');
    //   }
    // });
  }

  // Route navigating error
  navigatingError (err) {
    try {
      this.ea.publish('Unhandled-Error', {
        type: 'Navigating Error',
        path: err.error.instruction.previousInstruction.fragment + ' -> ' + err.error.instruction.fragment,
        params: err.error.instruction.params,
        error: {
          message: err.error.result.output.message,
          stack: err.error.result.output.stack
        }
      });
    } catch (e) {
      this.ea.publish('Unhandled-Error', e);
    }

    if (err.error.referrer) {
      this.refError(err.error.referrer);
    }
  }

  // Document referrer error
  refError (referrer) {
    this.ea.publish('Unhandled-Error', {
      type: 'Referrer',
      referrer: referrer.domain
    });
  }

  activate () {
    // Global Application Error Reporter
    this.ea.subscribe('Unhandled-Error', (err) => {
      let navigator = window.navigator;
      let url = window.location;
      let msg = {
        error: err,
        href: { host: url.host, pathname: url.pathname, search: url.search },
        meta: { platform: navigator.platform, vendor: navigator.vendor, userAgent: navigator.userAgent, browserVersion: browserVersion() }
      };
      // this.request.error(msg);
    });

    window.addEventListener('error', (errorEvent) => {
      if (errorEvent.error) {
        let msg = {
          type: 'Window Global',
          message: errorEvent.error.message,
          stack: errorEvent.error.stack
        };
        this.ea.publish('Unhandled-Error', msg);
      }
    });
  }
}
