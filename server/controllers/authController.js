'use strict';
const User = require('../models/user');
const facebook = require('../config/facebook');
const passport = require("../config/passport");

module.exports = {

  apiAuth: function(req, res, next) {
    if (!req.headers['authorization'] || !req.headers['authorization'].split(' ')[1])
      throw new Error('Auth required')

    const fbid = req.headers['authorization'].split(' ')[1]
    return User.findOne({ fbid: fbid })
      .then(user => {
        if (!user)
          throw new Error('You need to login with Facebook');

        req.user = user;
        return next();
      })
      .catch(err => next(err));
  },

  login: function(req, res, next) {
    passport.authenticate("facebook-token", { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) return next(new Error(info[0].error));
      return res.status(201).send(user);
    }
  )(req, res, next);
},

}
