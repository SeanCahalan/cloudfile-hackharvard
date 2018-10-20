'use strict';

// PUT ALL API ROUTE FUNCTIONS HERE

module.exports = {
  test: function(req, res, next) {
    console.log(req.user)
    return res.status(200).send(req.user);
  }
};
