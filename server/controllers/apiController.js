'use strict';
  const dropbox = require('../config/dropbox');

// PUT ALL API ROUTE FUNCTIONS HERE

module.exports = {
  test: function(req, res, next) {
    console.log(req.user)
    return res.status(200).send(req.user);
  },
  
  dropbox: function(req, res, next) {
    return dropbox.filesListFolder({path: ''})
      .then(results => res.status(200).send(results))
      .catch(err => next(err));

  }
};
