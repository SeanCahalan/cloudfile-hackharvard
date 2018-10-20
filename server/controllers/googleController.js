'use strict';
const google = require('../config/google');

module.exports = {

  upload: function(req, res, next) {
     return res.status(200).send('hello');
   }
};
