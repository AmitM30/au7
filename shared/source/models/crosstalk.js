
import { inject, computedFrom } from 'aurelia-framework';
import { InlineViewStrategy }   from 'aurelia-framework';

import { Config }               from '../services/config';

@inject(Config)
export class TsaheyluModel {

  model = {};

  constructor (config) {
    this.config = config;
  }

  @computedFrom('model')
  get view () {
    if (this.model && this.model.render) {
      return new InlineViewStrategy(this.model.render.templateString);
    }

    // TODO - handler.js logic can be shifted here
    switch (this.model.type) {
      case 'detail':
        return this.config.templateURL + '/modules/pdp' + this.config.moduleVersion + '.html';
      case 'list':
        return this.config.templateURL + '/modules/plp' + this.config.moduleVersion + '.html';
      default:
        return new InlineViewStrategy('<template></template>');
    }
  }
}
