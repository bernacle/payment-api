/**
 * Payment API - paying with Stripe API.
 *
 * @param app
 */

(function() {
  'use strict';

  const stripe = require('stripe')('sk_test_SdMuA7Oxhbte9PFpKYxqCKQq');

  // COMMON HTTP CODE
  const HTTP_OK = { code: 200, message: 'ok' };
  const HTTP_CREATED = { code: 201, message: 'created' };
  const HTTP_NO_CONTENT = { code: 204, message: 'no_content' };
  const HTTP_CONFLICT = { code: 209, message: 'conflict' };
  const HTTP_BAD_REQUEST = { code: 400, message: 'bad_request' };
  const HTTP_FORBIDDEN = { code: 403, message: 'forbidden' };
  const HTTP_NOT_FOUND = { code: 404, message: 'not_found' };
  const HTTP_SERVER_ERROR = { code: 500, message: 'server_error' };

  function paymentAPI(app) {
    const API_NAME = app.settings['API_NAME'];
    const PING = app.route(API_NAME + '/ping');
    const GET_TOKEN = app.route(API_NAME + '/token');
    const DO_PAYMENT = app.route(API_NAME + '/pay');

    PING.get((req, res) => {
      res
        .header('Content-Type', 'text/plain; charset=utf-8')
        .send('pong')
        .end();
    });

    GET_TOKEN.post((req, res) => {
      return stripe.tokens
        .create({
          card: {
            number: req.body.number,
            exp_month: req.body.exp_month,
            exp_year: req.body.exp_year,
            cvc: req.body.cvc
          }
        })
        .then(result =>
          res
            .status(HTTP_OK.code)
            .json(result)
            .end()
        )
        .catch(err =>
          res
            .status(err.statusCode)
            .json(err)
            .end()
        );
    });

    DO_PAYMENT.post((req, res) => {
      return stripe.charges
        .create({
          amount: req.body.amount,
          currency: 'usd',
          source: req.body.tokenId,
          description: 'Charge Things'
        })
        .then(result =>
          res
            .status(HTTP_OK.code)
            .json(result)
            .end()
        )
        .catch(err =>
          res
            .status(err.statusCode)
            .json(err)
            .end()
        );
    });
  }
  module.exports = paymentAPI;
})();
