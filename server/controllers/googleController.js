"use strict";
let google;

module.exports = {

  middleware: function(req, res, next) {
    const user = req.user;
    if (!user.google.access_token)
      return next('User has not added google')
    if (!google)
      google = require('../config/google')(user.google)

    return next();
  },

  fetch: function(req, res, next) {

    return google.files.list({
      fields: "nextPageToken, files(id, name, parents, mimeType)"
    })
    .then(result => {
      const files = result.data.files;
      let bibbity = [];
      for (let i = 0; i < files.length; i++) {
        let entry = files[i];
        bibbity.push({
          fileid: entry.id,
          name: entry.name,
          service: "google"
        });
      }

      return res.status(200).send(bibbity);
    })
    .catch(err => next(err));
  },

  delete: function(req, res, next) {
    const fileId = req.body.file;

    return google.files.delete({ fileId })
      .then(result => res.status(200).send(result.data))
      .catch(err => next(err))
  }
};
