/* eslint-disable no-undef */
import 'aurelia-bootstrapper-webpack';
import * as T from '../shared/source/plugins/t';

export function configure (aurelia) {
  aurelia.use
    .basicConfiguration()
    .developmentLogging()

  aurelia.use.globalResources('../shared/source/plugins/t');

  aurelia.start().then(() => {
    aurelia.setRoot('app', document.body)
  })
  // aurelia.start().then((a) => a.setRoot('app', document.getElementById('wadi')));
}
