"use strict";
let google;

let compareFiles = function(file1, file2) {
  return file1.parents.length - file2.parents.length;
};

let addFileToStructure = function(fs, file) {
  let path = fs;
  let parents = file.parents

  // get the part of the json we want to put the new file in
  for (i=0; i<parents.length; i++)
    path = path[parents[i]];

  path[file.id] = {
    name: file.name,
    type: file.mimeType.split('.').pop(),
    size: file.size,
    lastModified: file.modifiedTime,
    service: 'google'
  };
};

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
    fs.readFile(TOKEN_PATH, (err, token) => {
      const auth = oAuth2Client.setCredentials(JSON.parse(token));
      const drive = google.drive({ version: "v3", auth });
      drive.files.list(
        {
          fields: "nextPageToken, files(id, name, parents, mimeType)"
        },
        (err, res) => {
          if (err) return console.log("The API returned an error: " + err);
          let files = res.data.files;
          // sort files before putting them in the json
          files = files.sort(compareFiles);
          let fileStructure = {};
          for (let i = 0; i < files.length; i++) {
            let entry = files[i];
            addFileToStructure(fileStructure, entry);
          }
          res.status(200).send(fileStructure);
        }
      );
    });
  },

  delete: function(req, res, next) {
    const fileId = req.body.file;

    return google.files.delete({ fileId })
      .then(result => res.status(200).send(result.data))
      .catch(err => next(err))
  }
};
