"use strict";
const facebook = require('../config/facebook');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ============================ User Schema ============================ //

const UserSchema = new Schema({
  facebook: {
    id: { type: String, require: true },
    accessToken: { type: String, require: true },
    displayName: String,
    birthday: String,
    email: String,
    expiresOn: Date
  },
  credentials: {
    customerId: String,
    connectId: String
  },
  dropbox: {
    id: String,
    token: String
  },
  google: {
    access_token: String,
    refresh_token: String,
    scope: String,
    token_type: String,
    expiry_date: Number
  },
  cards: [
    {
      _id: { type: String, required: true },
      card_holder_name: String,
      brand: { type: String, required: true },
      exp: { type: Date, required: true },
      funding: { type: String, required: true },
      last4: { type: String, required: true }
    }
  ],
  banks: [
    {
      _id: { type: String, required: true },
      account_holder_name: String,
      bankName: { type: String, required: true },
      routing: { type: String, required: true },
      last4: { type: String, required: true }
    }
  ],
}, { timestamps: true });

UserSchema.methods.saveCard = function(card) {
  this.cards.push({
    _id: card.id,
    card_holder_name: card.name,
    brand: card.brand,
    exp: new Date(card.exp_year, card.exp_month - 1),
    funding: card.funding,
    last4: card.last4
  });

  return this.save().then(user => user.cards);
};

UserSchema.methods.saveBank = function(bank) {
  this.banks.push({
    _id: bank.id,
    account_holder_name: bank.account_holder_name,
    bankName: bank.bank_name,
    routing: bank.routing_number,
    last4: bank.last4
  });

  return this.save().then(user => user.banks);
};

module.exports = mongoose.model('User', UserSchema);
