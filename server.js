// server.js
// where your node app starts

// init project
/*
const express = require("express");
const app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
}); */

"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

mongoose.connect(
  process.env.DB || "mongodb://localhost/node-express-form-validation",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

// Api router
const apiRouter = require("./routes/api");

// Express settings
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Helmet settings
app.use(helmet());
app.use(helmet.xssFilter()); //Mitigate the risk of XSS - `helmet.xssFilter()`
app.use(helmet.noSniff()); //Avoid inferring the response MIME type - `helmet.noSniff()`

// Serve static resources
app.use(express.static("public"));

// Render View
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// Initiate API
app.use("/api/form", apiRouter);

//404 Not Found Middleware
app.use((req, res, next) => {
  return next({
    status: 404,
    message: "not found"
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
