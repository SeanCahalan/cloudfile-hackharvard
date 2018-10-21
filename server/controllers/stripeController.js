'use strict';
const stripe = require('../config/stripe');
const User = require('../models/user');
const SaleRequest = require('../models/saleRequest');

//2126037080774659

function shareDropbox(fileId, fileSender, fileReceiver) {
  const dropbox = require('../config/dropbox')(fileSender.dropbox.token)

  let members;
  if (fileReceiver.dropbox.id) {
    members = [{
      dropbox_id: fileReceiver.dropbox.id,
      '.tag': 'dropbox_id'
    }];
  }
  else {
    members = [{
      email: fileReceiver.facebook.email,
      '.tag': 'email'
    }]
  }

  return dropbox.sharingAddFileMember({
    file: fileId,
    members: members,
    quiet: false,
    access_level: { '.tag': 'viewer' },
    add_message_as_comment: false
  });
}

function shareGoogle(fileId, fileSender, fileReceiver) {
  const google = require("../config/google")(fileSender.google);

  var permissions = {
    type: "user",
    role: "reader",
    emailAddress: fileReceiver.facebook.email
  };

  return google.permissions.create({
    resource: permissions,
    fileId: fileId,
    fields: "id"
  })
}

module.exports = {

  addCard: function(req, res, next) {
    if (!req.body.token) return next(new Error());

    const user = req.user;
    const token = req.body.token;
    const credentials = user.credentials;
    const cards = user.cards;

    if (cards && cards.length >= 3)
      throw new Error("Can only have 3 payment methods");

    return stripe.customers.createSource(credentials.customerId, { source: token })
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
    const user = req.user;

    if (!user.banks || user.banks.length === 0)
      return next(new Error('You need a bank account to sell files'))

    return User.findOne({ 'facebook.id': fileReceiverFbid })
      .then(fileReceiver => {
        if (!fileReceiver)
          throw new Error('User does not exist');

        const saleRequest = new SaleRequest({
          sender: fileReceiver.id,
          receiver: user.id,
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
  acceptSaleRequest: function(req, res, next) {
    const requestId = req.params.requestId;
    const senderCreds = req.user.credentials;
    const user = req.user;
    if (!user.cards || user.cards.length === 0)
      return next(new Error('You need a payment method to purchase files'));

    let saleRequest;
    return SaleRequest.findOne(requestId)
      .populate('receiver').exec()
      .then(result => {
        saleRequest = result;
        if (saleRequest.sender !== user.id)
          throw new Error('You can only accept sale requests you have received');

        console.log('sale request')
        console.log(saleRequest)

        const receiverCreds = saleRequest.receiver.credentials;

        return stripe.charges.create({
          amount: Math.round(saleRequest.amount * 100),
          currency: "CAD",
          customer: senderCreds.customerId,
          destination: { account: receiverCreds.connectId }
        })
      })
      .then(result => {
        console.log('stripe result')
        console.log(result)

        return (saleRequest.service === 'dropbox' ?
          shareDropbox(saleRequest.file, saleRequest.receiver, user) :
          shareGoogle(saleRequest.file, saleRequest.receiver, user))
      })
      .then(result => {
        console.log('sharing result')
        console.log(result);
        return saleRequest.remove();
      })
      .then(() => res.status(201).send({ success: true }))
      .catch(err => next(err));

  },

  declineSaleRequest: function(req, res, next) {
    const requestId = req.params.requestId;
    return SaleRequest.findByIdAndDelete(requestId)
      .then(() => res.status(201).send({ success: true }))
      .catch(err => next(err))
  }
}
