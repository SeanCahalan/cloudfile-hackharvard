'use strict';
const dropboxController = require('../controllers/dropboxController');
const express = require('express');
const multer  = require('multer')
const upload = multer()

const dropboxRouter = express.Router();
dropboxRouter.post('/fetch', dropboxController.fetch);
dropboxRouter.post('/upload', upload.fields([{ name: 'file', maxCount: 1 },
  { name: 'path', maxCount: 1 }]), dropboxController.upload);
dropboxRouter.post('/download', dropboxController.download);
dropboxRouter.delete('/delete', dropboxController.delete);

module.exports = dropboxRouter;
