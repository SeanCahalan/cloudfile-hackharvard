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

    return google.files.list(
      {
        fields: "nextPageToken, files(id, name, parents, mimeType)"
      },
      (err, res) => {
        if (err) return console.log("The API returned an error: " + err);
        const files = res.data.files;
        let bibbity = [];
        for (let i = 0; i < files.length; i++) {
          let entry = files[i];
          bibbity.push({
            fileid: entry.id,
            name: entry.name,
            service: "google"
          });
        }
      }
    )
    .then(result => {
      console.log(result)
      return res.status(200).send(result)
    })
    .catch(err => next(err));
  },

  deleteFile: function(req, res, next) {
      google.files.delete({ fileId }, (err, res) => {
        if (err) return console.log("The API returned an error: " + err);
      });
  }
};
