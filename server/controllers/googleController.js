"use strict";
let google;

module.exports = {
  middleware: function(req, res, next) {
    const user = req.user;
    if (!user.google.access_token) return next("User has not added google");
    if (!google) google = require("../config/google")(user.google);

    return next();
  },

  fetch: function(req, res, next) {
    return google.files
      .list({
        fields: "nextPageToken, files(id, name, parents, mimeType)"
      })
      .then(result => {
        const files = result.data.files;
        let bibbity = [];
        for (let i = 0; i < files.length; i++) {
          let entry = files[i];
          bibbity.push({
            fileid: entry.id,
            name: entry.name,
            service: "google"
          });
        }

        return res.status(200).send(bibbity);
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
    const folderName = req.body.folderName;
    var fileMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder"
    };
    return drive.files
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
    // var fileId = req.body.fileId;
    // var permissions = [
    //   {
    //     type: "user",
    //     role: "writer",
    //     emailAddress: "user@example.com"
    //   },
    //   {
    //     type: "domain",
    //     role: "writer",
    //     domain: "example.com"
    //   }
    // ];
    // // Using the NPM module 'async'
    // async.eachSeries(
    //   permissions,
    //   function(permission, permissionCallback) {
    //     drive.permissions.create(
    //       {
    //         resource: permission,
    //         fileId: fileId,
    //         fields: "id"
    //       },
    //       function(err, res) {
    //         if (err) {
    //           // Handle error...
    //           console.error(err);
    //           permissionCallback(err);
    //         } else {
    //           console.log("Permission ID: ", res.id);
    //           permissionCallback();
    //         }
    //       }
    //     );
    //   },
    //   function(err) {
    //     if (err) {
    //       // Handle error
    //       console.error(err);
    //     } else {
    //       // All permissions inserted
    //     }
    //   }
    // );
  }
};
