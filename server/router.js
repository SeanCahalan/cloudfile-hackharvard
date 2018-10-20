"use strict";
const express = require("express");
const authController = require('./controllers/authController');
const authRouter = require('./routes/authRoutes');
const apiRouter = require('./routes/apiRoutes')
const errorMiddleware = require("./errors/middleware");

module.exports = function(app) {

  // attach routers and middleware to app
  app.use("/auth", authRouter);
  app.use("/api", authController.apiAuth, apiRouter);
  app.use("/", errorMiddleware);

  app.all("*", (req, res, next) =>  res.status(200).send('fuck you'));
};
