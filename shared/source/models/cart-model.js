
import { autoInject, computedFrom } from 'aurelia-framework';

import { Utils }                from '../misc/utils';
import { Config }               from '../services/config';

// Default order object
const DEFAULT_ORDER = {
  email: null,
  items: {},
  vendors: {},
  addresses: {},
  payment: {
    method: 'cc',
    card: {},
    token: {}
  },
  shop: null,
  misc: {
    newsletter: true,
    version: 'full-width',
    appName: 'doodle'         // TODO - changed
  },
  gift_option: 'f',
  gift_message: '',
  details: null,
  coupon: null,
  is_phone_verified: false,
  testing: null,
  use_wallet: false
};

// Default Address Object
const DEFAULT_ADDRESS = {
  address: null,
  address1: null,
  city: null,
  cellPhone: null,
  building_street_no: null,
  area: null,
  landmark: null,
  latitude: null,
  longitude: null,
  country: null,
  default: false,
  addressType: 'Home',
  isNew: false,
  name: null,
  phone: null,
  alternate_phone: null
};

//Default Credit card Object
const DEFAULT_CC = {
  first_name: null,
  last_name: null,
  expiry_year: null,
  expiry_month: null,
  ccv: null,
  number: null,
  save_card: true
};

const DEFAULT_TOKENIZATION = {
  id: null,
  cvv: null
};

// @inject(Config)
export class CartModel {

  constructor (config) {
    // this.tracking = config.tracking;

    // Initialize New order object
    Object.assign(this, DEFAULT_ORDER);

    // Shop assigned
    this.shop = config.locale.country.toUpperCase();
  }

  // @computedFrom('payment')
  get isValidPayment () {
    return (this.payment.method === 'cc' && this.payment.card.number) || this.payment.method === 'cod';
  }

  // @computedFrom('addresses')
  get isValidAddress () {
    return (this.addresses.shipping && this.addresses.shipping.name) ? true : false;
  }

  getDefaultAddressObject () {
    //Assigning default shop : REQUIRED by post review call
    DEFAULT_ADDRESS.country = this.shop;

    return Utils.copyObject(DEFAULT_ADDRESS);
  }

  getDefaultCCObject () {
    return Utils.copyObject(DEFAULT_CC);
  }

  getDefaultTokenizationObject () {
    return Utils.copyObject(DEFAULT_TOKENIZATION);
  }

  getDefaultOrderObject () {
    return Utils.copyObject(DEFAULT_ORDER);
  }
}
