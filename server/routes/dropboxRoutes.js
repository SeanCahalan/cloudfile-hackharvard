'use strict';
const dropboxController = require('../controllers/dropboxController');
const express = require('express');
const multer  = require('multer')
const upload = multer()

const dropboxRouter = express.Router();

// activate dropbox sdk
dropboxRouter.use(dropboxController.middleware);

dropboxRouter.get('/space', dropboxController.getSpace);
dropboxRouter.post('/fetch', dropboxController.fetch);
dropboxRouter.post('/upload', upload.fields([{ name: 'file', maxCount: 1 },
  { name: 'path', maxCount: 1 }]), dropboxController.upload);
dropboxRouter.post('/download', dropboxController.downloadUrl);
dropboxRouter.post('/folder', dropboxController.createFolder);
dropboxRouter.delete('/delete', dropboxController.delete);
dropboxRouter.post('/shareFile', dropboxController.shareFile);

module.exports = dropboxRouter;
