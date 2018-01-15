
import { autoInject, computedFrom } from 'aurelia-framework';

import { Utils }                from '../misc/utils';

/**
 * Format user address
 * @param  {Object} address user address
 * @return {Object} address formatted user address
 */
let formattedAddress = (address) => {
  if (address.firstName) {
    return {
      name: address.firstName + ' ' + address.lastName,
      city: address.city,
      building_street_no: address.buildingStreetNo,
      area: address.area,
      landmark: address.landmark,
      latitude: address.latitude,
      addressType: address.type,
      longitude: address.longitude,
      country: address.country.iso2Code,
      phone: address.cellPhone,
      cellPhone: address.cellPhone,
      'default': address.isDefaultShipping || false,
      idCustomerAddress: address.idCustomerAddress
    };
  } else {
    address.phone = address.phone || address.cellPhone;
    address.cellPhone = address.phone || address.cellPhone;

    return address;
  }
};

/**
 * Class UserModel
 */
export class UserModel {

  /**
   * create instance of userModel
   */
  constructor () {
    this.lang = lang;
    this.isLoggedIn = null;
    this.firstname = null;
    this.surname = null;
    this.email = null;
    this.gender = null;
    this.birthday = null;
    this.addresses = [];
    this.primaryPhone = null;
    this.skipPhoneVerification = false;
  }

  /**
   * Index of default address in user addresses
   * @type {Number} defaultIndex
   */
  defaultIndex = undefined;

  /**
   * Check if user has primary phone number
   * @return {boolean} isPhoneVerified
   */
  // @computedFrom('primaryPhone', 'skipPhoneVerification')
  get isPhoneVerified () {
    return (!!this.primaryPhone && !this.skipPhoneVerification);
  }

  /**
   * Check for guest user
   * @return {Boolean} isGuest
   */
  // @computedFrom('isLoggedIn', 'email')
  get isGuest () {
    return (!this.isLoggedIn && !!this.email);
  }

  /**
   * get valid user
   * @return {Boolean} isValidUser
   */
  // @computedFrom('isLoggedIn', 'isGuest', 'primaryPhone')
  get isValidUser () {
    return ((this.isLoggedIn || this.isGuest) && !!this.primaryPhone);
  }

  /**
   * Get default user address from user addresses
   * @return {Object} defaultAddress
   */
  @computedFrom('addresses')
  get defaultAddress () {
    let start = new Date().getTime();
    this.defaultIndex = this.addresses.findIndex((d) => { return d.default === true });
    if (this.defaultIndex >= 0) {
      return this.addresses[this.defaultIndex];
    }

    return {};
  }

  /**
   * Get other addresses from user addresses
   * @return {Array} others user addresses
   */
  // @computedFrom('defaultAddress')
  get otherAddresses () {
    let others = Utils.copyObject(this.addresses);
    if (this.defaultIndex >= 0) {
      others.splice(this.defaultIndex, 1);
    }
    return others || [];
  }

  /**
   * Check if user has default address
   * @return {Boolean} hasDefaultAddress
   */
  // @computedFrom('defaultAddress')
  get hasDefaultAddress () {
    return (this.defaultAddress && this.defaultAddress.name) ? true : false;
  }

  /**
   * Set users primary phone number
   * @param {Array} phoneNumbers array number of phoneNumbers
   * @return {String} primaryPhone user primary phone number
   */
  setPrimaryPhone (phoneNumbers) {
    let verifiedPhone = phoneNumbers.find(function (d) { if (d.isPrimary) { return d.number; } });
    if (verifiedPhone) {
      return verifiedPhone.number;
    }

    return null;
  }

  /**
   * Set user addressess
   * @param {Object} addresses array of addresses
   * @param {String} country   current country
   */
  setAddresses (addresses, country) {
    addresses = addresses.filter((address) => {
      if (!address.country) { return; }
      if (typeof address.country === 'string' && (address.country.toLowerCase() === country)) {
        return address;
      }
      if (address.country.iso2Code && (address.country.iso2Code.toLowerCase() === country)) {
        return address;
      }
    });

    this.addresses = addresses.map(formattedAddress);
  }
}
