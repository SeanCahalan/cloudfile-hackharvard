"use strict";
const config = require("./main");
const { Facebook } = require("fb");

module.exports = new Facebook({
  appId: config.facebook.app_id,
  appSecret: config.facebook.app_secret,
  version: "v3.0"
});
