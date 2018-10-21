'use strict';
const serviceController = require('../controllers/serviceController');
const express = require('express');

const serviceRouter = express.Router();
serviceRouter.use(serviceController.middleware);
serviceRouter.post('/', serviceController.addService);
serviceRouter.post('/googleAuth', serviceController.googleAuth);
serviceRouter.post('/googleToken', serviceController.googleToken);
serviceRouter.get('/me', serviceController.getMe);
serviceRouter.get('/fbFriends', serviceController.getFbFriends);

module.exports = serviceRouter;
