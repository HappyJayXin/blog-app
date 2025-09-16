const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();

const indexRoutes = require("./routes/index");
const imageRoutes = require("./routes/images");
const hbsHelpers = require("./helpers/hbs");

const app = express();

if (process.env.NODE_ENV !== "test") {
  const fallbackMongoUri = "mongodb://127.0.0.1:27017/blog-app";
  const mongoUri = process.env.MONGO_URI || fallbackMongoUri;
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI is not set. Using local MongoDB fallback.");
  }
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("✅ MongoDB connected");
    })
    .catch(error => {
      console.error("MongoDB connection error:", error);
    });
}

app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const hbs = exphbs.create({
  extname: ".hbs",
  defaultLayout: "main",
  helpers: hbsHelpers,
  partialsDir: path.join(__dirname, "views", "partials")
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use("/", indexRoutes);
app.use("/images", imageRoutes);

module.exports = app;

