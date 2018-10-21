"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ============================ Sale Request Schema ============================ //

// sender and receiver are in reference to money, not file

const SaleRequestSchema = new Schema({
  amount: { type: Number, required: true },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  service: {
    type: String,
    enum: ['dropbox', 'google'],
    required: true
  },
  file: { type: String, required: true },
  fileName: { type: String, required: true }
})

module.exports = mongoose.model('SaleRequest', SaleRequestSchema);
