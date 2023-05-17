const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const placesRoutes = require("./routes/places-route");
const usersRoutes = require("./routes/users-route");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use(() => {
  const error = new HttpError("Could not find route", 404);
  throw error;
});

// eslint-disable-next-line consistent-return
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error occured" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(app.listen(5001))
  .catch((err) => {
    console.log(err);
  });
