// add google sdk config, then module.exports = google
const config = require("./main");
const { google } = require("googleapis");

// TODO: use accessToken from user rather than config
module.exports = new google.auth.OAuth2({
  client_id: config.google.client_id,
  client_secret: config.google.client_secret,
  redirect_uris: config.google.redirect_uris[0]
});
