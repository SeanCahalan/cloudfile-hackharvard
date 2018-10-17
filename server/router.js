"use strict";
const express = require("express");
const authRouter = require('./routes/authRoutes');
const errorMiddleware = require("./errors/middleware");

module.exports = function(app) {
  // api router
  const apiRouter = express.Router();
  // apiRouter.use("/users", userRoutes);

  // attach routers and middleware to app
  app.use("/auth", authRouter);
  app.use("/api", apiRouter);
  app.use("/", errorMiddleware);

  app.all("*", (req, res, next) =>  res.status(200).send('fuck you'));
};
