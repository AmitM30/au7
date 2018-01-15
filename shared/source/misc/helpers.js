
export class Helpers {

  constructor () { }

  /**
   * Gets switch country url
   *
   * @param {string} lang Language - Default 'en'
   * @param {string} country Country - Default 'sa'
   *
   * @returns {string} url
   */
  static switch (lang, country) {
    lang = lang || 'en';
    country = country || 'en';
    let arr = window.location.host.split('.');
    arr[0] = lang + '-' + country;

    return '//' + arr.join('.');
  }

  /**
   * Converts custom render view object to template parameterised format
   *
   * @param {object} render widget configuration
   * @returns {object} json view-model
   */
  static initAsyncRender (render) {
    let json = {};
    render.json.forEach((settings) => {
      json[settings.uid] = json[settings.uid] || {};
      Object.keys(settings.json).map((attr) => {
        json[settings.uid][attr] = settings.json[attr];
      }, this);
    }, this);

    return json;
  }
}
