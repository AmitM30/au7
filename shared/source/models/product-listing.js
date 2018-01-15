
import { computedFrom }         from 'aurelia-framework';

export class ProductListingModel {

  constructor () {
    this.response = {};
  }

  @computedFrom('response')
  get products () {
    return this.response.data;
  }

  @computedFrom('response')
  get facets () {
    return this.response.facets;
  }

  @computedFrom('response')
  get search () {
    return this.response.search;
  }

  @computedFrom('response.meta', 'response.breadcrumbs')
  get plpTitle () {
    return (this.response.meta.seo && this.response.meta.seo.h1)
            ? this.response.meta.seo.h1
            : (this.response.breadcrumbs.length > 0) ? this.response.breadcrumbs[this.response.breadcrumbs.length - 1].name : undefined;
  }

  @computedFrom('response')
  get meta () {
    return this.response.meta;
  }

  get breadcrumbs () {
    return this.response.breadcrumbs;
  }

  @computedFrom('response')
  get totalCount () {
    return this.response.totalCount;
  }

  @computedFrom('response')
  get pages () {
    return this.response.pages;
  }

  selectedFacets () {
    let selected = {};

    for (let key in this.search) {
      if ((key !== 'category' && key !== 'sort' && key !== 'page' && key !== 'limit' && key !== 'searchKey' && key !== 'q')
          && this.search[key].length) {
        selected[key] = this.search[key];
      }
    }

    return selected;
  }

  getSimpleAndSupplier (sku, skuSimple, vendor) {
    let product = this.products.find(function (d) { return d.sku === sku; });

    let simple = {};
    if (product && skuSimple) {
      simple = product.simples.find(function (d) { return d.sku === sku; });
    }

    let supplier = {};
    if (simple && vendor) {
      supplier = simple.suppliers.find(function (d) { return d.vendor_code === vendor; });
    }

    return { product: product, simple: simple, supplier: supplier };
  }
}
