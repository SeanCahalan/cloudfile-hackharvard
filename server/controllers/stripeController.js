'use strict';
const stripe = require('../config/stripe');
const User = require('../models/user');
const SaleRequest = require('../models/saleRequest');
module.exports = {
  addCard: function(req, res, next) {
    if (!req.body.token) return next(new Error());

    const user = req.user;
    const token = req.body.token;
    const credentials = user.credentials;
    const cards = user.cards;

    if (cards && cards.length >= 3)
      throw new Error("Can only have 3 payment methods");

    return stripe.customers
      .createSource(credentials.customerId, { source: token })
      .then(card => {
        return Promise.all([
          user.saveCard(card),
          stripe.customers.update(user.credentials.customerId, {
            default_source: card.id
          })
        ]);
      })
      .then(results => res.status(201).send(results[0]))
      .catch(err => next(err));
  },

  addBank: function(req, res, next) {
    if (!req.body.token) return next(new Error());

    const user = req.user;
    const token = req.body.token;
    const credentials = user.credentials;
    const banks = user.banks;

    if (banks && banks.length >= 3)
      throw new Error("Can only have 3 payout methods");
    if (!credentials.connectId)
      throw new Error("User has no Stripe Connect account");

    return stripe.accounts
      .createExternalAccount(credentials.connectId, {
        external_account: token,
        default_for_currency: true
      })
      .then(bank => user.saveBank(bank))
      .then(updatedBanks => res.status(201).send(updatedBanks))
      .catch(err => next(err));
  },

  // user selling the file requests to sell it to someone else
  sendSaleRequest: function(req, res, next) {
    const fileReceiverFbid = req.body.fileReceiverFbid; // or sender of funds
    const file = req.body.file;
    const fileName = req.body.fileName;
    const service = req.body.service;
    const amount = req.body.amount;
    const uid = req.user.id;

    return User.findOne({ 'facebook.id': fileReceiverFbid })
      .then(fileReceiver => {
        if (!fileReceiver)
          throw new Error('User does not exist');

        const saleRequest = new SaleRequest({
          sender: fileReceiver.id,
          receiver: uid,
          amount: amount,
          file: file,
          fileName: fileName,
          service: service
        })
        return saleRequest.save();
      })
      .then(request => res.status(201).send(request))
      .catch(err => next(err));
  },

  getReceivedSaleRequests: function(req, res, next) {
    return SaleRequest.find({ sender: req.user.id })
      .populate('receiver', 'facebook.displayName').exec()
      .then(saleRequests => res.status(200).send(saleRequests))
      .catch(err => next(err))
  },

  // user accepting sale request will call this
  // will need to do sharing here as well
  acceptSaleRequest: function(req,res, next) {
    const amount = req.body.amount;
    const requestId = req.params.requestId;
    const senderCreds = req.user.credentials;

    return SaleRequest.findById(requestId)
      .populate('receiver', 'credentials').exec()
      .then(saleRequest => {
        const receiverCreds = saleRequest.receiver.credentials;

        return stripe.charges.create({
          amount: Math.round(amount * 100),
          currency: "CAD",
          customer: senderCreds.customerId,
          destination: { account: receiverCreds.connectId }
        })

        // TODO: share file

        // TODO: delete sale request
      })
  },

  declineSaleRequest: function(req, res, next) {
    const requestId = req.params.requestId;
    return SaleRequest.findByIdAndDelete(requestId)
      .then(() => res.status(201).send({ success: true }))
      .catch(err => next(err))
  }
}
