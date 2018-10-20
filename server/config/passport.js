"use strict";
const passport = require("passport");
const facebook = require('./facebook');
const User = require("../models/user");
const config = require("./main");
const FacebookTokenStrategy = require("passport-facebook-token");

// exchange short-lived fb token for long-lived fb token
function exchangeFacebookToken(user) {
  return facebook
    .api("oauth/access_token", {
      client_id: config.facebook.app_id,
      client_secret: config.facebook.app_secret,
      grant_type: "fb_exchange_token",
      fb_exchange_token: user.facebook.accessToken
    })
    .then(response => {
      const longLivedToken = response.access_token;
      const expiry = response.expires_in;
      const today = new Date();

      user.facebook.accessToken = longLivedToken;
      user.facebook.expiresOn = today.addDays(expiry / 86400);
      console.log('token exchanged')
      return user.save();
    });
}

// fetch fb sdk credentials from fb.js
const fbCredentials = {
  clientID: config.facebook.app_id,
  clientSecret: config.facebook.app_secret
};

const fbLogin = new FacebookTokenStrategy(fbCredentials, function(
  accessToken,
  refreshToken,
  profile,
  done
) {
  // if user is new, save,
  // if user is already in db, return user
  return User.findOne({ "facebook.id": profile.id })
    .then(existingUser => {
      if (existingUser) {
        existingUser.facebook.accessToken = accessToken;
        return existingUser.save();
      }

      let user = new User({
        facebook: {
          id: profile.id,
          displayName: profile.displayName,
          accessToken: accessToken
        }
      });

      return user.save();
    })
    .then(user => exchangeFacebookToken(user))
    .then(user => done(null, user))
    .catch(err => done(err, false));
});

passport.use(fbLogin);

module.exports = passport;
