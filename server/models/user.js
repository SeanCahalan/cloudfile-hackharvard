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
  }
}, { timestamps: true });


module.exports = mongoose.model('User', UserSchema);
