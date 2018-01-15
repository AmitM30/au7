
import { inject }               from 'aurelia-framework';
import { EventAggregator }      from 'aurelia-event-aggregator';

import { API }                  from './core/api';
import { Storage }              from './core/storage';
import { Queue }                from './core/queue';
import { Config }               from './config';
import { UserModel }            from '../models/user';
import { CartModel }            from '../models/cart-model';
import { Utils }                from '../misc/utils';

/**
 * format user address according to my acccount specs
 * @param  {Object} address Customer address object
 * @param  {Object} userConfig Customer details default values
 * @return {Object} formattedAddress formatted address
 */
let formatAddress = (address, userConfig) => {
  if (address.name.split(' ').length > 1) {
    address.firstName = address.name.split(' ')[0];
    address.lastName = address.name.split(' ')[1];
  }

  return {
    firstName: address.firstName || address.name,
    lastName: address.lastName || userConfig.fallBackLastName,
    idCustomerAddress: address.idCustomerAddress,
    city: address.city,
    isDefaultShipping: address.default,
    fkCountry: address.country,
    type: address.addressType || userConfig.defaultAddressType,
    cellPhone: address.cellPhone || address.phone,
    buildingStreetNo: address.buildingStreetNo,
    area: address.area,
    landmark: address.landmark,
    latitude: '',
    longitude: '',
    proximity: ''
  };
};

/**
 * The User service is single point for all
 * user specific information
 */
@inject(API, Storage, UserModel, CartModel, Config, EventAggregator)
export class User {

  isCartReady = false;

  constructor (api, storage, userModel, cartModel, config, ea) {
    this.info = userModel;
    this.api = api;
    this.config = config;
    this.storage = storage;
    this.cartModel = cartModel;
    this.queue = new Queue();

    ea.subscribe('cart-ready', () => {
      this.isCartReady = true;
      this.queue.queue.map((obj) => {
        obj.resolve(this[obj.type](obj.data));
      });
    });
    // this.activate();
  }

  setUserData (res) {
    let info = new UserModel();
    if (res.success) {
      info.isLoggedIn = true;
      info.firstname = res.firstName || res.firstname;
      info.surname = res.lastName || res.surname;
      info.email = res.email;
      info.primaryPhone = (res && res.phones) ? info.setPrimaryPhone(res.phones) : null; // TODO - change to flag from API
      if (this.cartModel.addresses && this.cartModel.addresses.shipping) {
        this.cartModel.addresses.shipping.city = res.city;
      }
      if (window.order && window.order.phoneNumber) {
        info.primaryPhone = window.order.phoneNumber;
        info.skipPhoneVerification = true;
      }
    } else {
      info.isLoggedIn = false;
      if (res.email) {
        info.email = res.email;
      }
    }

    return info;
  }

  login (user) {
    return this.api.postRequest(this.config.apis.login, user)
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((res) => {
            this.info = this.setUserData(res);
            return this.info;
            // return this.storage.removeItem('currentUser').then((res) => { return { success: true }; });
          });
        }

        return { success: false, message: response.text() };
      }).catch((err) => {
        return err.text().then((msg) => {
          this.info = this.setUserData({});
          return { success: false, message: msg };
        });
      });
  }

  guestLogin (user) {
    if (!this.isCartReady) {
      return new Promise((resolve, reject) => {
        this.queue.enqueue({ type: 'guestLogin', data: user, resolve: resolve });
      });
    }

    this.info = this.setUserData(user);
    // TODO - set for if App
    // return this.storage.setItem('currentUser', user.email);
  }

  logout () {
    return this.api.getRequest(this.config.apis.logout).then(() => {
      return this.storage.removeItem('currentUser').then(() => {
        this.info = this.setUserData({});
        this.cartModel.addresses.shipping = this.cartModel.getDefaultAddressObject();
        this.cartModel.addresses.billing = this.cartModel.getDefaultAddressObject();
        return this.info;
      });
    });
  }

  getCities () {
    return this.api.getRequest(this.config.apis.cities)
      .then((response) => response.json(), (err) => err.json());
  }

  getAreas () {
    return this.api.getRequest(this.config.apis.areas)
      .then((response) => response.json(), (err) => err.json());
  }

  setAddressInStorage () {
    this.storage.setItem('addresses', this.cartModel.addresses.shipping);
  }

  getAddressFromStorage () {
    return this.storage.getItem('addresses').then((res) => {
      if (res) {
        let data = Utils.stringToJSON(res);
        if (data && data.token) {
          this.cartModel.addresses.shipping = Utils.stringToJSON(data.token);
          return { data:[ this.cartModel.addresses.shipping ] };
        }
      } else {
        return { success: false };
      }
    });
  }

  passwordResetRequest (user) {
    return this.api.postRequest(this.config.apis.passReset.replace("{email}", user.email))
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((res) => {
            if (res.success === true) {
              return { message: JSON.parse(res.data).message };
            }
            return { message: res.message };
          });
        }
        return { success: false, message: "Request failed. Please try again." };
      })
      .catch((err) => {
        if (err.headers.get('Content-Type') === 'text/html') {
          return { success: false, message: "Request failed. Please try again." };
        }
        return err.text().then((msg) => {
          return { success: false, message: msg };
        });
      });
  }

  sendOTP (userPhone) {
    let req = {
      phoneNumber: userPhone.phoneNumber,
      type: userPhone.type,
      email: this.info.email,
      isLoggedIn: this.info.isLoggedIn
    };

    return this.api.postRequest(this.config.apis.sendOTP, req)
      .then((response) => response.json(), (err) => { return { success: false, message: 'Request failed. Please try again' } });
  }

  verifyOTP (userPhoneVerify) {
    let req = {
      phoneNumber: userPhoneVerify.phoneNumber,
      email: this.info.email,
      verificationCode: userPhoneVerify.verificationCode
    };

    return this.api.postRequest(this.config.apis.verifyOTP, req)
      .then((response) => response.json(), (err) => { return { success: false, message: 'Request failed. Please try again' } });
  }

  checkUserExistence (userEmail) {
    return this.api.getRequest(this.config.apis.userExist.replace('{email}', userEmail))
      .then((response) => response.json(), (err) => { return { success: false, message: msg } });
  }

  getUserFromStorage () {
    return this.storage.getItem('currentUser').then((res) => {
      let data = Utils.stringToJSON(res);

      if (data && data.token) {
        this.info = this.setUserData({ email: Utils.stringToJSON(data.token) });
      } else {
        this.info = this.setUserData({});
      }

      return this.info;
    });
  }

  status () {
    return this.api.getRequest(this.config.apis.userStatus).then((response) => {
        return response.json().then((res) => {
          this.info = this.setUserData(res);
          window.dispatchEvent(new CustomEvent('user-loaded'));
          return this.info;
        });
      }).catch((err) => {
        this.info = this.setUserData({});
        return this.info;
      });
  }

  addresses () {
    return this.api.getRequest(this.config.apis.userAddress)
      .then((response) => response.json(), (err) => { return { success: false } });
  }


  /**
   * Create new customer address or update existing address
   * @param {Object} address customer address
   * @return {Object}
   */
  createOrUpdateAddress (address) {
    return this.api.postRequest(this.config.apis.createAddress, formatAddress(address, this.config.user))
      .then((response) => response.json(), (err) => err.json());
  }

  /**
   * Executes a POST request for newsletter signup
   *
   * @param {string} customer customer object
   * @returns {Promise} 201 status code
   */
  signUp (customer) {
    let data = {
      gender: customer.gender,
      email: customer.email,
      firstName: this.config.user.fallBackSignupFirstName,
      lastName: this.config.user.fallBackSignupLastName,
      language : this.config.locale.lang,
      country: this.config.locale.country,
      utm_campaign: 'signup',
      utm_source: 'DIRECT'
    }

    return this.api.postRequest(this.config.apis.subscribe, data)
      .then((response) => response.json(), (err) => err.json());
  }

  /**
   * Create new customer address or update existing address
   * @param {Object} address customer address
   * @return {Object}
   */
  createOrUpdateAddress (address) {
    return this.api.postRequest(this.config.apis.createAddress, formatAddress(address, this.config.user))
      .then((response) => response.json(), (err) => err.json());
  }

  idCheck (token) {
    return this.api.postRequest(this.config.apis.idCheck, { token: token })
      .then((response) => response.json(), (err) => err.json());
  }

  uploadIDDocument (data) {
    return this.api.postFormData(this.config.apis.uploadDocument, { file: data.file, token: data.token })
      .then((response) => response.json(), (err) => err.json());
  }

  socialLogin (data) {
    return this.api.postRequest(this.config.apis.socialLogin, data)
      .then((response) => this.status(), (err) => err.json());
  }

  savePrimaryPhone (data) {
    this.api.postRequest(this.config.apis.primaryPhone, data);
  }

  passwordResetRequestV2 (user) {
    return this.api.postRequest(this.config.apis.passResetRequestV2.replace("{email}", user.email))
      .then((response) => response.json(), (err) => err.json());
  }

  passwordResetV2 (passwordData) {
    return this.api.putRequest(this.config.apis.passResetV2, passwordData)
      .then((response) => this.status(), (err) => err.json());
  }

  createNewUser (userEmail) {
    let newUser = {
      email: userEmail,
      password: this.config.user.defaultPassword,
      gender: this.config.user.defaulGender,
      lastName: this.config.user.fallBackLastName,
      firstName: this.config.user.fallBackSignupFirstName,
      country: this.config.country,
      language: this.config.lang
    };

    return this.api.postRequest(this.config.apis.createNewUser, newUser).then((response) => this.status(), (err) => err.json());
  }

  getSavedCard (email) {
    return this.api.getRequest(this.config.apis.getCardTokens.replace("{email}", email))
      .then(
        (res) => {
          return res.json();
      })
      .catch((err) => {
        return err.json();
      });
  }

  deleteCard (tokenId) {
    this.api.deleteRequest(this.config.apis.deleteCardTokens.replace("{tokenId}", tokenId));
  }

  activate () {
    console.log('Activate: USER');
  }
}
