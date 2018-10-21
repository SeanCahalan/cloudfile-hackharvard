"use strict";
const fs = require("fs");
const stream = require("stream");
let google;

let compareFiles = function(file1, file2) {
  return file1.parents.length - file2.parents.length;
};

let beautifyFile = function(file) {
  return {
    id: file.id,
    name: file.name,
    type: file.mimeType.split(".").pop(),
    size: file.size,
    lastModified: file.modifiedTime,
    service: "google"
  };
};

let populateDirectory = function(directoryID, files) {
  directory = {};
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    if (file.parents[0] == directoryID) directory[file.id] = beautifyFile(file);
  }
  return directory;
};

let structureDriveList = function(driveList) {
  let fileSystem = {};
  let currentDirIds = new Set();
  // get the root dir
  for (let i = 0; i < driveList.length; i++) {
    let file = driveList[i];
    if (file.parents[0].length < 32) fileSystem[file.id] = beautifyFile(file);
    currentDirIds.add;
  }

  // do all deeper layers
  while (driveList.length > 0) {
    for (let i = 0; i < driveList.length; i++) {
      let file = driveList[i];
    }
  }
};

module.exports = {
  middleware: function(req, res, next) {
    const user = req.user;
    if (!user.google.access_token) return next("User has not added google");
    if (!google) google = require("../config/google")(user.google);

    return next();
  },

  fetch: function(req, res, next) {
    const parentId = req.body.parentId;
    const query = "'" + parentId + "'" + " in parents";
    return google.files
      .list({
        q: query,
        fields:
          "nextPageToken, files(id, name, parents, mimeType, modifiedTime, size)"
      })
      .then(result => {
        let files = result.data.files;
        let bibbity = [];
        for (let i = 0; i < files.length; i++) {
          let entry = files[i];
          bibbity.push(beautifyFile(entry));
        }
        res.status(200).send(bibbity);
      })
      .catch(err => next(err));
  },

  delete: function(req, res, next) {
    const fileId = req.body.file;

    return google.files
      .delete({ fileId })
      .then(result => res.status(200).send(result.data))
      .catch(err => next(err));
  },

  createFolder: function(req, res, next) {
    const folderName = req.body.name;
    const parentId = req.body.parentId;
    var fileMetadata = {
      name: folderName,
      parents: "['" + parentId + "']",
      mimeType: "application/vnd.google-apps.folder"
    };
    return google.files
      .create({
        resource: fileMetadata,
        fields: "id"
      })
      .then(result => res.status(200).send(result.data))
      .catch(err => next(err));
  },

  download: function(req, res, next) {
    const fileId = req.body.fileId;
    return google.files
      .get({
        fileId: fileId,
        fields: "webContentLink"
      })
      .then(result => res.status(200).send(result.data.webContentLink))
      .catch(err => next(err));
  },

  upload: function(req, res, next) {
    if (!req.files.file[0]) return next(new Error("No file provided"));
    if (!req.body.parentId) return next(new Error("No parent ID provided"));

    const file = req.files.file[0];
    const fileMetadata = {
      name: file.originalname,
      parentId: "['" + req.files.parentId + "']"
    };

    let bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const media = {
      //body: fileStream.put(file.buffer)
      body: bufferStream
    };

    return google.files
      .create({
        resource: fileMetadata,
        media: media,
        fields: "id, size"
      })
      .then(result => {
        res.status(201).send(result.data.size);
      })
      .catch(err => next(err));
  },

  shareFile: function(req, res, next) {
    var fileId = req.body.fileId;
    //var sharedEmail = req.body.sharedEmail;
    const fbidToShare = req.body.fbid;

    return User.findOne({ 'facebook.id': fbidToShare })
      .then(user => {
        let fbEmail = user.facebook.email;

        let permissions = {
          type: "user",
          role: "writer",
          emailAddress: fbEmail
        };

        return google.permissions.create({
          resource: permissions,
          fileId: fileId,
          fields: "id"
        });
      })
      .then(result => res.status(200).send(result))
      .catch(err => next(err));
  },

  getSpace: function(req, res, next) {
    return google.about
      .get({ fields: "storageQuota" })
      .then(result => {
        return res.status(200).send({
          used: Math.round(result.data.storageQuota.usage / 10000000) / 100,
          total: Math.round(result.data.storageQuota.limit / 10000000) / 100
        });
      })
      .catch(err => next(err));
  }
};
