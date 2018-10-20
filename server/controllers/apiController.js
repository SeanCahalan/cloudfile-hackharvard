'use strict';
  const dropbox = require('../config/dropbox');

// PUT ALL API ROUTE FUNCTIONS HERE

module.exports = {

  fetchDropbox: function(req, res, next) {
    return dropbox.filesListFolder({path: ''})
      .then(results => res.status(200).send(results))
      .catch(err => next(err));

  },

  // TODO: make a more general route for uploading
  // path example: "/files/images"
  uploadDropbox: function(req, res, next) {
    if (!req.files.file[0])
      return next(new Error('No image provided'));
    if (!req.body.path)
      return next(new Error('No path provided'))

    const file = req.files.file[0];
    const path = req.body.path
    return dropbox.filesUpload({ path: `${path}/${file.originalname}`, contents: file.buffer })
      .then(result => res.status(201).send(result))
      .catch(err => next(err));
  },

  // this is some whack fuckery but i think it works
  downloadDropbox: function(req, res, next) {
    if (!req.body.path)
      return next(new Error('No path provided'))
    const path = req.body.path;
    return dropbox.filesDownload({ path: path })
      .then(results => {
        const data = results.fileBinary
        const fileName = results.name;
        const fileSplit = fileName.split('.')
        const extension = fileSplit[fileSplit.length-1];

        res.writeHead(200, {
          'Content-Type': `application/${extension}`,
          'Content-Disposition': `attachment; filename=${fileName}`,
          'Content-Length': data.length
        });
        res.end(data);
      })
      .catch(err => next(err));
  }
};
