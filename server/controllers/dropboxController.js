'use strict';
const dropbox = require('../config/dropbox');

module.exports = {
  readDropbox: function(req, res, next) {
    return dropbox.filesListFolder({path: req.body.path})
      .then(results => {
        bibbity = [];
        for (i=0; i<results.entries.length; i++) {
          entry = results.entries[i];
          bibbity.push({
            'name': entry.name,
            // ask sean if he needs this cased or without file name appended
            'path': entry.path_lower,
            'source': 'Dropbox'
          });
        }
        res.status(200).send(bibbity);
      })
      .catch(err => next(err));
  }

}
