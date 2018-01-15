
import { inject }               from 'aurelia-framework';

import { Common }               from '../services/common';

@inject(Common)
export class PreRenderStep {

  constructor (common) {
    this.common = common;
  }

  run (routingContext, next) {
    // Close navigation panel
    if (document.querySelector('paper-drawer-panel')) {
      document.querySelector('paper-drawer-panel').closeDrawer();
    }

    // Set App state - 'checkout', 'app'
    this.common.state = routingContext.config.name === 'checkout' ? 'checkout' : 'app';
    this.common.bodyClass = routingContext.config.name === 'checkout' ? (this.common.bodyClass + ' section-checkout') : this.common.bodyClass.replace('section-checkout', '');

    return next();
  }
}
