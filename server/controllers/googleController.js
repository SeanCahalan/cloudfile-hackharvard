"use strict";
const fs = require("fs");
const { google } = require("googleapis");
const oAuth2Client = require("../config/google");
const TOKEN_PATH = "../config/token.json";

module.exports = {
  fetchDrive: function(req, res, next) {
    fs.readFile(TOKEN_PATH, (err, token) => {
      const auth = oAuth2Client.setCredentials(JSON.parse(token));
      const drive = google.drive({ version: "v3", auth });
      drive.files.list(
        {
          fields: "nextPageToken, files(id, name, parents, mimeType)"
        },
        (err, res) => {
          if (err) return console.log("The API returned an error: " + err);
          const files = res.data.files;
          let bibbity = [];
          for (let i = 0; i < files.length; i++) {
            let entry = files[i];
            bibbity.push({
              fileid: entry.id,
              name: entry.name,
              service: "google"
            });
          }
        }
      );
    });
  },

  deleteFile: function(req, res, next) {
    fs.readFile(TOKEN_PATH, (err, token) => {
      const auth = oAuth2Client.setCredentials(JSON.parse(token));
      const drive = google.drive({ version: "v3", auth });
      drive.files.delete({ fileId }, (err, res) => {
        if (err) return console.log("The API returned an error: " + err);
      });
    });
  }
};
