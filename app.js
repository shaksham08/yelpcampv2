const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

//Models
const Campground = require("./models/campground");
const app = express();

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database Connected");
});

//app.set(name, value)
//Assigns setting name to value. You may store any value that you want, but certain names can be used to configure the behavior of the server.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campground/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campground/new");
});

app.post("/campgrounds", async (req, res) => {
  const { title, description, location, price } = req.body;
  const newCampground = new Campground({ title, description, location, price });
  await newCampground.save();
  res.redirect("/campgrounds");
});

const PORT = 1234;
app.listen(PORT, function () {
  console.log(`The server is running at port : ${PORT}`);
});
