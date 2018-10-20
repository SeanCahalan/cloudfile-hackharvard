"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ============================ User Schema ============================ //

const UserSchema = new Schema({
  facebook: {
    id: { type: String, require: true },
    accessToken: { type: String, require: true },
    email: String,
    expiresOn: Date
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
