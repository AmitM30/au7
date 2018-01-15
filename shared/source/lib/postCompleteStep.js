
export class PostCompleteStep {
  run (routingContext, next) {
    window.scrollTo(0, 0);

    let searchBox = document.querySelector('search-element');
    if (searchBox) {
      searchBox.suggest = null;
      let searchInput = document.querySelector('search-element input');
      searchInput.blur();
    }

    if (document.querySelector('#mainNavScrim')) {
      document.querySelector('#mainNavScrim').classList.remove('active');
    }

    if (document.querySelector('.main-nav-wrapper')) {
      document.querySelector('.main-nav-wrapper').classList.remove('active');
    }

    let cartSlider = document.getElementById('cart-sidebar');
    if (cartSlider) {
      cartSlider.classList.remove('showing');
    }

    return next();
  }
}
