const express = require("express");
const path = require("path");
const app = express();

const PORT = 1234;

//app.set(name, value)
//Assigns setting name to value. You may store any value that you want, but certain names can be used to configure the behavior of the server.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, function () {
  console.log(`The server is running at port : ${PORT}`);
});
