"use strict";
const express = require("express");
const authController = require('./controllers/authController');
const authRouter = require('./routes/authRoutes');
const dropboxRouter = require('./routes/dropboxRoutes');
const googleRouter = require('./routes/googleRoutes');
const serviceRouter = require('./routes/serviceRoutes');
const stripeRouter = require('./routes/stripeRoutes');
const errorMiddleware = require("./errors/middleware");

module.exports = function(app) {

  const apiRouter = express.Router();
  apiRouter.use('/dropbox', dropboxRouter);
  apiRouter.use('/google', googleRouter);
  apiRouter.use('/services', serviceRouter);
  apiRouter.use('/stripe', stripeRouter);

  // attach routers and middleware to app
  app.use("/auth", authRouter);
  app.use("/api", authController.apiAuth, apiRouter);
  app.use("/", errorMiddleware);

  app.all("*", (req, res, next) =>  res.status(200).send('fuck you'));
};
