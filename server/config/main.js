// export all required env variables here
module.exports = {
  database: process.env.MONGODB_URI,
  node_env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000
};
