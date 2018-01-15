
/**
 * App Notifications class
 */
export class Notifier {

  constructor () {
    this.message = null;

    // this.activate();
  }

  setMessage (message) {
    this.message = null;
    let fn = function () { this.message = message; };
    // Break event loop in case old and
    // new message value is same
    window.setTimeout(fn.bind(this), 0);
  }

  activate () {
    console.log('Activate: NOTIFIER');
  }
}
