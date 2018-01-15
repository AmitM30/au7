
import { inject }               from 'aurelia-framework';

import { XDomain }              from './xdomain';

/**
 * Internal Class to manage storing
 * information in cookies
 */
@inject(XDomain)
class CookieStorage {

  static read (name, b) {
    return new Promise((resolve, reject) => {
      window.xdLocalStorage.readCart(name, (res) => {
        if (res.value && typeof res.value === 'string') {
          try {
            res.value = JSON.parse(res.value);
            resolve(res.value[name]);
          } catch (e) {
            resolve({});
          }
        }
        resolve({});
      });
    });
  }

  static write (name, data, path = '/', expiry) {
    return new Promise((resolve, reject) => {
      window.xdLocalStorage.writeCart(name, { data: data, path: path, expiry: expiry }, (res) => { resolve(res.value); });
      // window.xdLocalStorage.writeCookie(name, { data: data, path: path, expiry: expiry }, (res) => { resolve(res.value); });
    });
  }

  static clear (name) {
    return new Promise((resolve, reject) => {
      window.xdLocalStorage.clearCookie(name, (res) => { resolve(res.value); });
    });
  }
}

/**
 * Internal Class to manage storing
 * information in local storage
 */
@inject(XDomain)
class LocalStorage {

  constructor () { }

  getItem (key) {
    return new Promise((resolve, reject) => {
      window.xdLocalStorage.getItem(key, (res) => { resolve(res.value); });
    });
  }

  setItem (key, obj) {
    return new Promise((resolve, reject) => {
      window.xdLocalStorage.setItem(key, obj, (res) => { resolve(res.value); });
    });
  }

  removeItem (key) {
    return new Promise((resolve, reject) => {
      window.xdLocalStorage.removeItem(key, (res) => { resolve(res.value); });
    });
  }
}

/**
 * The Storage service manages persistent information
 * storage using local storage / cookie
 * and can send same data to backend if requested
 */
export class Storage extends LocalStorage {

  constructor (config) {
    super();
    this.config = config;

    this.isLocalStorageSupported = this.checkLocalStore;
  }

  get checkLocalStore () {
    if (typeof localStorage === 'object') {
      try {
        localStorage.setItem('localStorage', 1);
        localStorage.removeItem('localStorage');
      } catch (e) {
        console.warn('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
        return false;
      }
    }
    return true;
  }

  /**
   * Method to get item from persistent storage
   *
   * @param {string} [key] key name
   * @returns {Promise} returns a promise
   */
  getItem (key) {
    return this.isLocalStorageSupported ? super.getItem(key) : CookieStorage.read(key);
  }

  /**
   * Method to set item to persistent storage
   *
   * @param {string} [key] key name
   * @param {string} [obj] data to be stored. Stored as
   * {
   *    token:     JSON.stringify(obj) || '',
   *    updated:   new Date(),
   *    session:   false
   * }
   * @returns {Promise} returns a promise
   */
  setItem (key, obj) {
    let requestObj = JSON.stringify({
      token: JSON.stringify(obj) || '',
      expire: 2148580800000,
      extend: ["*"]
    });
    // updated: new Date(), session: false

    return this.isLocalStorageSupported ? super.setItem(key, requestObj) : CookieStorage.write(key, requestObj);
  }

  /**
   * Method to remove item from persistent storage
   *
   * @param {string} [key] key name
   * @returns {Promise} returns a promise
   */
  removeItem (key) {
    return this.isLocalStorageSupported ? super.removeItem(key) : CookieStorage.clear(key);
  }

  /**
   * Method to get cookie value
   *
   * @param {string} [key] key name
   * @returns {Promise} returns a promise
   */
  getCookie (key) {
    return CookieStorage.read(key);
  }

  /**
   * Method to set cookie
   *
   * @param {string} [key] key name
   * @param {string} [obj] data to be saved
   * @param {string} [path] path - Default '/'
   * @param {string} [expiry] expiry - Default 1 day
   * @returns {Promise} returns a promise
   */
  setCookie (key, obj, path, expiry) {
    return CookieStorage.write(key, obj, path, expiry);
  }

  /**
   * Method to remove cookie
   *
   * @param {string} [key] key name
   * @returns {Promise} returns a promise
   */
  removeCookie (key) {
    return CookieStorage.clear(key);
  }
}

// TODO - Add functionality to save data to API

// Check
// Extra cookies not supported by API - Invalid Cookie error

  // return {
  //     extend:         callExtend,
  //     retrieve:       callRetrieve,
  //     expire:         callExpire,
  //     registerObject: callRegisterObject,
  //     getItem:        getItem,
  //     setItem:        setItem,
  //     removeItem:     removeItem,
  //     isLocalStorageAvailable: isLocalStorageAvailable,
  //     disabled:       unsupported
  // };

// const internals = {
//     isLocalStorageAvailable: (function () {
//         let ua = navigator.userAgent.toLowerCase();
//         if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) {
//             return false;
//         }

//         try {
//             localStorage.setItem('test', '1');
//             localStorage.removeItem('test');
//             return true;
//         } catch (error) {
//             return false;
//         }
//     })()
// };
