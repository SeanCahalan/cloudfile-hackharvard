'use strict';
module.exports = {
  addService: function(req, res, next) {
    const service = req.body.service;
    const token = req.body.token;
    var user = req.user;
    user[service].token = token;
    return user.save()
      .then(user => res.status(201).send(user))
      .catch(err => next(err));
  },
};
