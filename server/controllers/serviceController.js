const {google} = require("googleapis");

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

  googleAuth: function(req, res, next) {
    console.log('what the fuck')
    const appUrl = req.body.url;
    console.log('appurl:',appUrl)
      const SCOPES = [
          "https://www.googleapis.com/auth/drive",
          "https://www.googleapis.com/auth/drive.appdata",
          "https://www.googleapis.com/auth/drive.file",
          "https://www.googleapis.com/auth/drive.metadata",
          "https://www.googleapis.com/auth/drive.metadata.readonly",
          "https://www.googleapis.com/auth/drive.photos.readonly",
          "https://www.googleapis.com/auth/drive.readonly"
      ];

    const oAuth2Client = new google.auth.OAuth2(
      "219082002868-jn4q1i7cfqlf77qe8ldf46tkfg23hooh.apps.googleusercontent.com",
      "EmTMVLtGPd-LDh1mhIXoE8dw",
      appUrl
    );
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log("google url", authUrl)
    
    res.send(authUrl);
    },
    googleToken: function(req, res, next) {
        let code = req.body.code;
        console.log('code:', code)
        const oAuth2Client = new google.auth.OAuth2(
            "219082002868-jn4q1i7cfqlf77qe8ldf46tkfg23hooh.apps.googleusercontent.com",
            "EmTMVLtGPd-LDh1mhIXoE8dw",
            appUrl
          );

          //code=code from url
        oAuth2Client.getToken(code, (err, token) => { 
            if(err)
                console.log(err)
            res.send(token);
        });
    }
};
