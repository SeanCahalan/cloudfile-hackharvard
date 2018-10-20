"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ============================ User Schema ============================ //

const UserSchema = new Schema({
  fbid: {
    type: String,
    required: true
  },
  dropbox: {
    token: String
  },
  google: {
    token: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
