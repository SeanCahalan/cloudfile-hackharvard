"use strict";
require("dotenv").config();
Promise = require("bluebird");
const bodyParser = require("body-parser");
const logger = require("morgan");
const router = require("./router");
const config = require("./config/main");
const express = require("express");

// mongoose config

const mongoose = require("mongoose");
mongoose.Promise = Promise;

// set up database
mongoose.connect(
  config.database,
  { useNewUrlParser: true }
);

mongoose.connection.on("connected", () => console.log("mongodb connected"));
mongoose.connection.on("open", () => console.log("mongodb connection opened"));
mongoose.connection.on("error", err => console.log("mongodb error: " + err));
mongoose.connection.on("disconnected", () => {
  console.log("mongodb disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("mongodb disconnected after app termination");
    process.exit(0);
  });
});


const app = express();

// basic middleware
app.use(logger('dev'));
app.use(bodyParser.json());

router(app);


app.listen(config.port, () => {
  console.log("Server listening on port " + config.port + "...");
});
