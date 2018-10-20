'use strict';
let dropbox;

function getDropboxId(user) {
  return dropbox.usersGetCurrentAccount()
    .then(account => {
      user.dropbox.id = account.account_id
      return user.save();
    })
}

module.exports = {
  middleware: function(req, res, next) {
    const user = req.user;
    if (user.dropbox.token && !dropbox)
      dropbox = require('../config/dropbox')(user.dropbox.token)
    return next();
  },

  // for dropbox, body: { token: dropbox_token, service: 'dropbox' }
  /* google drive:
    body: {
      access_token: {google_access_token},
      refresh_token: {google_refresh_token},
      scope: {google_scope},
      token_type: {google_token_type},
      expiry_date: {google_expiry_date},
      service: 'google'
    }
  */
  addService: function(req, res, next) {
    var body = req.body;
    const service = body.service;
    delete body.service;

    var user = req.user;
    user[service] = body;

    return user.save()
      .then(user => {
        if (service === 'dropbox') {
          return getDropboxId(user);
        }

        return Promise.resolve(user);
      })
      .then(user => res.status(200).send(user))
      .catch(err => next(err));
  },
};
