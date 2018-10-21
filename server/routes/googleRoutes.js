'use strict';
const googleController = require('../controllers/googleController');
const express = require('express');
const multer = require('multer');
const upload = multer();

const googleRouter = express.Router();
googleRouter.use(googleController.middleware)

googleRouter.post('/fetch', googleController.fetch);
googleRouter.post('/folder', googleController.createFolder);
googleRouter.post('/upload', upload.fields([{ name: 'file', maxCount: 1 },
  { name: 'parentId', maxCount: 1 }]), googleController.upload);
googleRouter.post('/share', googleController.shareFile);
googleRouter.get('/space', googleController.getSpace);
googleRouter.delete('/delete', googleController.delete);

module.exports = googleRouter;
