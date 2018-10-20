'use strict';
const drive = require('../config/drive');

module.exports = {
  fetchDrive: function(req, res, next) {
    return drive.PLACEHOLDERDRIVEFUNCTIONAAAAAAAHHHH({path: req.body.path})
      .then(results => {
        bibbity = [];
        for (i=0; i<results.entries.length; i++) {
          entry = results.entries[i];
          bibbity.push({
            'name': entry.name,
            // ask sean if he needs this cased or without file name appended
            'path': entry.path_lower,
            'source': 'Drive'
          });
        }
        res.status(200).send(bibbity);
      })
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
    return drive.PLACEHOLDERDRIVEFUNCTIONAHAHAHAHHHHHHH({ path: `${path}/${file.originalname}`, contents: file.buffer })
      .then(result => res.status(201).send(result))
      .catch(err => next(err));
  },

  // this is some whack fuckery but i think it works
  downloadDropbox: function(req, res, next) {
    if (!req.body.path)
      return next(new Error('No path provided'))
    const path = req.body.path;
    return drive.PLACEHOLDERDRIVEFUNCTIONAAAAAAHHH({ path: path })
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
