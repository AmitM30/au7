(function (window) {
    'use strict';

    if (!window.checkout) {
        /**
         * Create and dispatch a new HTMLEvent
         *
         * @param event
         * @param data
         * @returns {boolean}
         */
        var fireEvent = function (event, data) {
            var evt = document.createEvent('HTMLEvents');
            evt.data = data;
            evt.initEvent(event, true, true);

            return !document.dispatchEvent(evt);
        };

        window.checkout = {
            /**
             * Set an `order` on the `window.order` object
             * and emit a `checkoutImport` HTMLEvent
             *
             * @param {object} order
             * @returns {object}
             */
            import: function (order) {
                window.order = order;
                fireEvent.call(window, 'checkoutImport', order);

                return order;
            }
        };
    }
})(window);

// Test App Scenario
(function () {
    if (window.location.search.indexOf('..showdebug..=on') >= 0) {
        window.checkout.import(
            {
                deviceId: "8d3e866c2510d28f",
                email: "amit.mangal+debug@wadi.com",
                guest: "true",
                orderReview: {
                    payment:{"method":"cc"},"addresses":{"billing":{"country":"ae"},"shipping":{"country":"ae"} },
                    invoice: [{"type":"subtotal","value":"12500"},{"type":"cod_fee","value":"0"},{"type":"shipping","value":"0"},{"type":"discount","value":"0"},{"type":"gift_wrap","value":"0"},{"type":"total","value":"12500"},{"type":"total_usd","value":"3404.00"}],
                    language: "en",
                    items: {
                        "AP771EL65LIC-562851": { "quantity":"1","price":"305300.00" }
                    },
                    gift_wrap_activated:0, shop: "ae", gift_wrap_allowed: 1
                }
            }
        );
    }
})(window);
