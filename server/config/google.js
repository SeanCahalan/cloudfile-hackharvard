const config = require("./main");
const { google } = require("googleapis");

module.exports = function(googleConfig) {
  var oAuth2Client = new google.auth.OAuth2(
    config.google.client_id,
    config.google.client_secret,
    config.google.redirect_uris[0]
  );

  oAuth2Client.setCredentials(googleConfig)
  return google.drive({ version: "v3", auth: oAuth2Client });
}
