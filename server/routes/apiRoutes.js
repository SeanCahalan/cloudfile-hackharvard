'use strict';
const apiController = require('../controllers/apiController');
const express = require('express');

// PUT ALL API ROUTE DEFINITIONS HERE

const apiRouter = express.Router();
apiRouter.get('/test', apiController.test);

module.exports = apiRouter;
