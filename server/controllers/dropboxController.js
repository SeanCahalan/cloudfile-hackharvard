'use strict';
const User = require('../models/user');

let dropbox;

module.exports = {
  // path example: "/files/images"
  // path = '' for home directory

  middleware: function(req, res, next) {
    const user = req.user;
    if (!user.dropbox.token)
      return next('User has not added dropbox')
    if (!dropbox)
      dropbox = require('../config/dropbox')(user.dropbox.token)
    return next();
  },

  getSpace: function(req, res, next) {
    return dropbox.usersGetSpaceUsage()
      .then(result => {
        return res.status(200).send({
          used: Math.round(result.used*100/1000000000)/100,
          total: Math.round(result.allocation.allocated*100/1000000000)/100
        })
      })
      .catch(err => next(err))
  },

  fetch: function(req, res, next) {
    const path = req.body.path;
    return Promise.all([
      dropbox.filesListFolder({ path: path }),
      dropbox.sharingListReceivedFiles(),
      dropbox.sharingListFolders()
    ])
    .then(([owned, sharedFiles, sharedFolders]) => {
      let bibbity = [];
      for (let i=0; i < owned.entries.length; i++) {
        let entry = owned.entries[i];
        bibbity.push({
          'id': entry.id,
          'name': entry.name,
          'size': entry.size,
          'last_modified': entry.server_modified,
          'service': 'dropbox',
        });
      }

      let bibbityShared = [];
      const shared = sharedFiles.entries.concat(sharedFolders.entries)
      for (let i=0; i < shared.length; i++) {
        let entry = shared[i];
        bibbityShared.push({
          'id': entry.id,
          'name': entry.name,
          'size': entry.size,
          'last_modified': entry.server_modified,
          'service': 'dropbox',
        });
      }
      return res.status(200).send({
        owned: bibbity,
        shared: bibbityShared
      });
    })
    .catch(err => next(err));
  },

  upload: function(req, res, next) {
    if (!req.files.file[0])
      return next(new Error('No file provided'));
    if (!req.body.path)
      return next(new Error('No path provided'))

    const file = req.files.file[0];
    const path = req.body.path
    return dropbox.filesUpload({ path: `${path}/${file.originalname}`, contents: file.buffer })
      .then(result => res.status(201).send(result))
      .catch(err => next(err));
  },

  // this is some whack fuckery but i think it works
  download: function(req, res, next) {
    if (!req.body.path)
      return next(new Error('No path provided'))
    const path = req.body.path;
    return dropbox.filesDownload({ path: path })
      .then(results => {
        const data = results.fileBinary
        const fileName = results.name;
        const fileSplit = fileName.split('.')
        const extension = fileSplit[fileSplit.length-1];

        res.writeHead(200, {
          'Content-Type': `application/${extension}`,
          'Content-Disposition': `attachment; filename=${fileName}`,
          'Content-Length': data.length
        });
        res.end(data);
      })
      .catch(err => next(err));
  },

  delete: function(req, res, next) {
    if (!req.body.path)
      return next(new Error('No path provided'));

    const path = req.body.path;
    return dropbox.filesDelete({ path: path })
      .then(result => res.status(201).send(result))
      .catch(err => next(err));
  },

  createFolder: function(req, res, next) {
    if (!req.body.path)
      return next(new Error('No path provided'));

    const path = req.body.path;
    return dropbox.filesCreateFolder({ path: path })
      .then(result => res.status(201).send(result))
      .catch(err => next(err))
  },

  shareFile: function(req, res, next) {
    const file = req.body.file; // this has the format id:gIHVCSMIN0AAAAAAAAADVw
    const fbidToShare = req.body.fbid;
    const access = req.body.access; // can be 'editor' or 'viewer'
    // TODO: right now only access type of editor works
    return User.findOne({ 'facebook.id': fbidToShare })
      .then(user => {

        let members;
        if (user.dropbox.id) {
          members = [{
            dropbox_id: user.dropbox.id,
            '.tag': 'dropbox_id'
          }];
        }
        else {
          members = [{
            email: user.facebook.email,
            '.tag': 'email'
          }]
        }

        return dropbox.sharingAddFileMember({
          file: file,
          members: members,
          quiet: false,
          access_level: { '.tag': access },
          add_message_as_comment: false
        });
      })
      .then(result => res.status(200).send(result))
      .catch(err => next(err))
  }


};
