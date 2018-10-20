'use strict';
module.exports = {

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
      .then(user => res.status(201).send(user))
      .catch(err => next(err));
  },
};
