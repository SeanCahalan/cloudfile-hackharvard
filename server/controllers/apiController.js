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

  },

  uploadDropbox: function(req, res, next) {
    if (!req.file)
      throw new NoDataError('No image provided');
    console.log(req.file)

    return dropbox.filesUpload({ path: `/${req.file.originalname}`, contents: req.file.buffer })
      .then(result => res.status(201).send(result))
      .catch(err => next(err));
  }
};
