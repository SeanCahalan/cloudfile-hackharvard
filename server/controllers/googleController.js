"use strict";
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
    const directoryID = req.body.directoryID;
    const query = "'" + directoryID + "'" + " in parents";
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
    // var fileId = "0BwwA4oUTeiV1UVNwOHItT0xfa2M";
    // var dest = fs.createWriteStream("/tmp/photo.jpg");
    // drive.files
    //   .get({
    //     fileId: fileId,
    //     alt: "media"
    //   })
    //   .on("end", function() {
    //     console.log("Done");
    //   })
    //   .on("error", function(err) {
    //     console.log("Error during download", err);
    //   })
    //   .pipe(dest);
  },

  upload: function(req, res, next) {
    // var fileMetadata = {
    //   'name': 'photo.jpg'
    // };
    // var media = {
    //   mimeType: 'image/jpeg',
    //   body: fs.createReadStream('files/photo.jpg')
    // };
    // drive.files.create({
    //   resource: fileMetadata,
    //   media: media,
    //   fields: 'id'
    // }, function (err, file) {
    //   if (err) {
    //     // Handle error
    //     console.error(err);
    //   } else {
    //     console.log('File Id: ', file.id);
    //   }
    // });
  },

  shareFile: function(req, res, next) {
    var fileId = req.body.fileId;
    var sharedEmail = req.body.sharedEmail;
    var permissions = {
      type: "user",
      role: "writer",
      emailAddress: sharedEmail
    };
    return drive.permissions
      .create({
        resource: permissions,
        fileId: fileId,
        fields: "id"
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
