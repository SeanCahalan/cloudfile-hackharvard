const config = require('./main');
const fetch = require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;

module.exports = function(accessToken) {
  return new Dropbox({ accessToken: accessToken, fetch: fetch });
};
