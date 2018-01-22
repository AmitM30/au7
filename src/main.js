/* eslint-disable no-undef */
import 'isomorphic-fetch';
import 'aurelia-bootstrapper';
// import 'aurelia-bootstrapper-webpack';
import '../shared/source/plugins/t';

import { LogManager }           from 'aurelia-framework';

import { Settings }             from './config/settings';
import { UnhandledError }       from '../shared/source/services/unhandled-error';

export async function configure (aurelia) {

  LogManager.addAppender(aurelia.container.get(UnhandledError));
  LogManager.setLevel(LogManager.logLevel.debug);

  console.log('PRODUCTION: ', PRODUCTION);

  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  // if (!PRODUCTION) {
  //   aurelia.use.developmentLogging();
  // }

  aurelia.use.plugin('aurelia-html-import-template-loader');
  aurelia.use.plugin('aurelia-animator-css');
  aurelia.use.globalResources('../shared/source/plugins/t');

  document.addEventListener('deviceready', onDeviceReady, false);
  function onDeviceReady() {
      console.log('DEVICE READY');
      aurelia.start().then((a) => a.setRoot('app', document.getElementById('wadi')));
  };
}
