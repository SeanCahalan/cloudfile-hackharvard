"use strict";
const express = require("express");
const errorMiddleware = require("./errors/middleware");

module.exports = function(app) {
  // api router
  const apiRouter = express.Router();
  // apiRouter.use("/users", userRoutes);

  // attach routers and middleware to app
  //app.use("/auth", authRouter);
  app.use("/api", apiRouter);
  app.use("/", errorMiddleware);
};
