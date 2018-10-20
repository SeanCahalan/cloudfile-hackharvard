'use strict';
const apiController = require('../controllers/apiController');
const express = require('express');
const multer  = require('multer')
const upload = multer()

// PUT ALL API ROUTE DEFINITIONS HERE

const apiRouter = express.Router();
apiRouter.get('/test', apiController.test);
apiRouter.get('/dropbox/fetch', apiController.dropbox);
apiRouter.post('/dropbox/upload', upload.single('file'), apiController.uploadDropbox);

module.exports = apiRouter;
