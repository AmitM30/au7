
import { inject }               from 'aurelia-framework';
import { InlineViewStrategy }   from 'aurelia-framework';
import { Router }               from 'aurelia-router';

import { Notifier }             from '../../services/notifier';

@inject(Router, Notifier)
export class Error {

  constructor (router, notifier) {
    this.router = router;
    this.notifier = notifier;
  }

  activate (params, routeConfig) {
    this.notifier.setMessage(window.translate.messaging('PaymentDeclined'));
    this.router.navigate('/checkout/payment');
  }

  attached () { }

  getViewStrategy () {
    return new InlineViewStrategy("<template><div></div></template>");
  }
}
