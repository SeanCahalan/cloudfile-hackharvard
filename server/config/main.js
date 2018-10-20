// export all required env variables here
module.exports = {
  dropbox: {
    access_token: process.env.DROPBOX_ACCESS_TOKEN
  },
  database: process.env.MONGODB_URI,
  node_env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000
};
