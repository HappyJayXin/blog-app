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
const postRoutes = require("./routes/posts");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const hbs = exphbs.create({
  extname: ".hbs",
  defaultLayout: "main",
  helpers: {
    formatDate(date) {
      // format date
      return new Date(date).toLocaleDateString();
    },
    truncate(str, len) {
      // shorten text
      return str.length > len ? str.substring(0, len) + "..." : str;
    }
  },
  partialsDir: path.join(__dirname, "views", "partials")
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

const mongoUri = process.env.MONGO_URI;
mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/", indexRoutes);
app.use("/posts", postRoutes);

module.exports = app;

