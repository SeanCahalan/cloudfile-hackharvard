// export all required env variables here
module.exports = {
  dropbox: {
    access_token: process.env.DROPBOX_ACCESS_TOKEN,
    app_key: process.env.DROPBOX_APP_KEY,
    app_secret: process.env.DROPBOX_APP_SECRET
  },
  google: {
    client_id:
      "219082002868-jn4q1i7cfqlf77qe8ldf46tkfg23hooh.apps.googleusercontent.com",
    project_id: "hackharvard-220001",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://www.googleapis.com/oauth2/v3/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "EmTMVLtGPd-LDh1mhIXoE8dw",
    redirect_uris: ["https://cloudfile.localtunnel.me/oauth"],
    javascript_origins: ["https://cloudfile.localtunnel.me"]
  },
  database: process.env.MONGODB_URI,
  node_env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000
};
