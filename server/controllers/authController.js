'use strict';
const User = require('../models/user');

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

    const fbid = req.body.fbid;

    return User.findOne({ fbid: fbid })
      .then(existingUser => {
        if (!existingUser) {
          console.log('creating new user');
          const user = new User({ fbid: fbid });
          return user.save()
        }
        return Promise.resolve(user);
      })
      .then(user => res.status(200).send(user))
      .catch(err => next(err));
  },

}
