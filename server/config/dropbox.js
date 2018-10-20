const config = require('./main');
const fetch = require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
module.exports = new Dropbox({ accessToken: config.dropbox.access_token, fetch: fetch });
