"use strict";
const fs = require("fs");
const { google } = require("googleapis");
const oAuth2Client = require("../config/google");
const TOKEN_PATH = "../config/token.json";

let compareFiles = function(file1, file2) {
  return file1.parents.length - file2.parents.length;
};

let addFileToStructure = function(fs, file) {
  let path = fs;
  let parents = file.parents

  // get the part of the json we want to put the new file in
  for (i=0; i<parents.length; i++)
    path = path[parents[i]];

  path[file.id] = {
    name: file.name,
    type: file.mimeType.split('.').pop(),
    size: file.size,
    lastModified: file.modifiedTime,
    service: 'google'
  };
};

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
          let files = res.data.files;
          // sort files before putting them in the json
          files = files.sort(compareFiles);
          let fileStructure = {};
          for (let i = 0; i < files.length; i++) {
            let entry = files[i];
            addFileToStructure(fileStructure, entry);
          }
          res.status(200).send(fileStructure);
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
