
import { bindable, bindingMode } from 'aurelia-framework';
import { InlineViewStrategy }   from 'aurelia-framework';
import { inject }               from 'aurelia-framework';
import { EventAggregator }      from 'aurelia-event-aggregator';

import { ProductListingModel }  from '../models/product-listing';
import { TsaheyluModel }        from '../models/crosstalk';
import { Helpers }              from '../misc/helpers';
import { Utils }                from '../misc/utils';

// https://github.com/aurelia/templating-resources/blob/master/src/compose.js
@inject(ProductListingModel, TsaheyluModel, EventAggregator)
export class SuperViewModel {

  secretMessage = 'Woaah!';

  @bindable({ defaultBindingMode: bindingMode.oneWay }) model;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) viewModel;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) view;

  constructor (productsListingModel, tsaheyluModel, ea) {
    this.productsListingModel = productsListingModel;

    // TODO - Improve
    // Clear of the model after view has been rendered
    this.modelWatcher = ea.subscribe('router:navigation:complete', () => { tsaheyluModel.model = {}; });
  }

  activate (model) {
    this.model = model;

    switch (model.type) {
      case 'list':
        this.productsListingModel.response = model;
        this.params = Utils.getQueryParamsAsObject();
        break;
    };

    if (model && model.render) {
      this.json = Helpers.initAsyncRender(model.render);
    }
  }

  modelChanged (newValue, oldValue) {
    // console.log('modelChanged');
  }

  bind (bindingContext, overrideContext) {
    // this.bindingContext = bindingContext;
    // this.overrideContext = overrideContext;
  }

  attached () { }

  viewChanged (newValue, oldValue) { }

  getViewStrategy () {
    if (this.model && this.model.render) {
      return new InlineViewStrategy(this.model.render.templateString);
    }

    return new InlineViewStrategy(`<template>${ this.secretMessage }</template>`);
  }

  deactivate () {
    this.modelWatcher.dispose();
  }

  // render () {
  //   // console.log('render: ', this.model);
  //   // let template = // this.model.render.templateString;
  //   //   `<template><compose view="${view}"></compose></template>`;
  //   // let viewFactory = this.viewCompiler.compile(template);
  //   // let view = viewFactory.create(this.container);
  //   // this.viewSlot.add(view);
  // }
}
