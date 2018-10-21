'use strict';
const googleController = require('../controllers/googleController');
const express = require('express');

const googleRouter = express.Router();
googleRouter.use(googleController.middleware)

googleRouter.post('/fetch', googleController.fetch);
googleRouter.get('/space', googleController.getSpace);
googleRouter.delete('/delete', googleController.delete);

module.exports = googleRouter;
