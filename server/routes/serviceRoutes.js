'use strict';
const serviceController = require('../controllers/serviceController');
const express = require('express');

const serviceRouter = express.Router();
serviceRouter.post('/', serviceController.addService);

module.exports = serviceRouter;
