'use strict';
const stripeController = require('../controllers/stripeController');
const express = require('express');

const stripeRouter = express.Router();

stripeRouter.post('/card', stripeController.addCard);
stripeRouter.post('/bank', stripeController.addBank);
stripeRouter.post('/saleRequests', stripeController.sendSaleRequest);
stripeRouter.get('/saleRequests', stripeController.getReceivedSaleRequests);
stripeRouter.post('/saleRequests/:requestId/accept', stripeController.acceptSaleRequest);
stripeRouter.delete('/saleRequests/:requestId', stripeController.declineSaleRequest);

module.exports = stripeRouter;
