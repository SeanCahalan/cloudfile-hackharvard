'use strict';
  const dropbox = require('../config/dropbox');

// PUT ALL API ROUTE FUNCTIONS HERE

module.exports = {

  dropbox: function(req, res, next) {
    return dropbox.filesListFolder({path: ''})
      .then(results => res.status(200).send(results))
      .catch(err => next(err));

  },

  // TODO: make a more general route for uploading
  // path example: "/files/images"
  uploadDropbox: function(req, res, next) {
    if (!req.files.file[0])
      throw new Error('No image provided');
    if (!req.body.path)
      return next(new Error('No path provided'))

    const file = req.files.file[0];
    const path = req.body.path
    return dropbox.filesUpload({ path: `${path}/${file.originalname}`, contents: file.buffer })
      .then(result => res.status(201).send(result))
      .catch(err => next(err));
  }
};
