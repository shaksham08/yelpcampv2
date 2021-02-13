const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const Campgorunds = require("./routes/campgrounds");
const Reviews = require("./routes/reviews");

//inititalizing express
const app = express();

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database Connected");
});

const sessionConfig = {
  secret: "thisshouldbeasecret",
  resave: false,
  saveUninititalized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

//Assigns setting name to value. You may store any value that you want, but certain names can be used to configure the behavior of the server.
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(methodOverride("_method"));
app.use(session(sessionConfig));

//All router
app.use("/", Campgorunds);
app.use("/campgrounds/:id", Reviews);
app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  if (!err.message) err.message = "Something went Wrong";
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).render("error", { err });
});

const PORT = 1234;
app.listen(PORT, function () {
  console.log(`The server is running at port : ${PORT}`);
});
