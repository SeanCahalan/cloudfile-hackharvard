'use strict';
const stripe = require('../config/stripe');
const User = require('../models/user');
const facebook = require('../config/facebook');
const passport = require("../config/passport");

function addStripe(user, ip) {
  let birthday;
  return facebook.api('/me', {
    fields: "birthday",
    access_token: user.facebook.accessToken
  })
  .then(result => {
    birthday = result.birthday
    const dob = {
      day: birthday.split('/')[1],
      month: birthday.split('/')[0],
      year: birthday.split('/')[2]
    };

    return Promise.all([
      stripe.customers.create({
        email: user.facebook.email,
        metadata: { database_id: user.id }
      }),
      stripe.accounts.create({
        country: "CA",
        type: "custom",
        email: user.facebook.email,
        default_currency: "CAD",
        metadata: { database_id: user.id },
        payout_schedule: {
          interval: "manual"
        },
        legal_entity: {
          type: "individual",
          first_name: user.facebook.displayName.split(' ')[0],
          last_name: user.facebook.displayName.split(' ')[1],
          dob: dob
        },
        tos_acceptance: {
          date: Math.floor(Date.now() / 1000),
          ip: ip
        }
      })
    ])
  })
  .then(([custAcct, connectAcct]) => {
    user.credentials.customerId = custAcct.id;
    user.credentials.connectId = connectAcct.id
    user.facebook.birthday = birthday
    return user.save();
  })
}

module.exports = {

  apiAuth: function(req, res, next) {
    if (!req.headers['authorization'] || !req.headers['authorization'].split(' ')[1])
      throw new Error('Auth required')

    const fbid = req.headers['authorization'].split(' ')[1]
    return User.findOne({ 'facebook.id': fbid })
      .then(user => {
        if (!user)
          throw new Error('You need to login with Facebook');

        req.user = user;
        return next();
      })
      .catch(err => next(err));
  },

  login: function(req, res, next) {
    const ip = req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"].split(",").pop()
      : req.connection.remoteAddress;

    passport.authenticate("facebook-token", { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) return next(new Error(info[0].error));

      return (user.isNew ? addStripe(user, ip) : Promise.resolve(user))
        .then(user => res.status(201).send(user))
        .catch(err => next(err));
    }
  )(req, res, next);
},

}
