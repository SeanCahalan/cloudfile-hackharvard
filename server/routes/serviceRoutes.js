'use strict';
const serviceController = require('../controllers/serviceController');
const express = require('express');

const serviceRouter = express.Router();
serviceRouter.use(serviceController.middleware);
serviceRouter.post('/', serviceController.addService);
serviceRouter.post('/googleAuth', serviceController.googleAuth);
module.exports = serviceRouter;
