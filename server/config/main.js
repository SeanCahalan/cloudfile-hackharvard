// export all required env variables here
module.exports = {
  dropbox: {
    access_token: process.env.DROPBOX_ACCESS_TOKEN,
    app_key: process.env.DROPBOX_APP_KEY,
    app_secret: process.env.DROPBOX_APP_SECRET
  },
  google: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    project_id: process.env.GOOGLE_PROJECT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: process.env.GOOGLE_REDIRECT_URIS.split(','),
    javascript_origins: process.env.GOOGLE_JAVASCRIPT_ORIGINS.split(',')
  },
  facebook: {
    app_secret: process.env.FACEBOOK_APP_SECRET,
    app_id: process.env.FACEBOOK_APP_ID
  },
  stripe: {
    api_key: process.env.STRIPE_API_KEY
  },
  database: process.env.MONGODB_URI,
  node_env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000
};
