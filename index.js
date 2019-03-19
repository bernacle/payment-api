(function() {
  'use strict';

  const express = require('express');
  const bodyParser = require('body-parser');
  let paymentAPI = require('./api/payment-api');

  const API_NAME = '/payment';

  let app = express();

  app.use(bodyParser.json());

  app.set('API_NAME', API_NAME);

  paymentAPI(app);

  app.listen(3000, () => {
    console.log('Server listening on port %d e pid %s', 3000, process.pid);
  });
})();
