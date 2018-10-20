'use strict';
const dropboxController = require('../controllers/dropboxController');
const express = require('express');
const multer  = require('multer')
const upload = multer()

const dropboxRouter = express.Router();
dropboxRouter.get('/fetch', dropboxController.fetchDropbox);
dropboxRouter.post('/upload', upload.fields([{ name: 'file', maxCount: 1 },
  { name: 'path', maxCount: 1 }]), dropboxController.uploadDropbox);
dropboxRouter.post('/download', dropboxController.downloadDropbox);

module.exports = dropboxRouter;
