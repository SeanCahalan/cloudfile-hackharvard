'use strict';
let dropbox;

module.exports = {
  // path example: "/files/images"
  // path = '' for home directory

  middleware: function(req, res, next) {
    const user = req.user;
    if (!user.dropbox.token)
      return next('User has not added dropbox')
    if (!dropbox)
      dropbox = require('../config/dropbox')(user.dropbox.token)
    return next();
  },

  fetch: function(req, res, next) {
    const path = req.body.path;
    return dropbox.filesListFolder({ path: path })
      .then(results => {
        let bibbity = [];
        for (let i=0; i < results.entries.length; i++) {
          let entry = results.entries[i];
          bibbity.push({
            'name': entry.name,
            'size': entry.size,
            'last_modified': entry.server_modified,
            'service': 'dropbox'
          });
        }
        return res.status(200).send(bibbity);
      })
      .catch(err => next(err));
  },

  upload: function(req, res, next) {
    if (!req.files.file[0])
      return next(new Error('No file provided'));
    if (!req.body.path)
      return next(new Error('No path provided'))

    const file = req.files.file[0];
    const path = req.body.path
    return dropbox.filesUpload({ path: `${path}/${file.originalname}`, contents: file.buffer })
      .then(result => res.status(201).send(result))
      .catch(err => next(err));
  },

  // this is some whack fuckery but i think it works
  download: function(req, res, next) {
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
  },

  delete: function(req, res, next) {
    if (!req.body.path)
      return next(new Error('No path provided'));

    const path = req.body.path;
    return dropbox.filesDelete({ path: path })
      .then(result => res.status(201).send(result))
      .catch(err => next(err));
  },

  createFolder: function(req, res, next) {
    if (!req.body.path)
      return next(new Error('No path provided'));

    const path = req.body.path;
    return dropbox.filesCreateFolder({ path: path })
      .then(result => res.status(201).send(result))
      .catch(err => next(err))
  }


};