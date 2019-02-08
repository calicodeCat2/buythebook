const express = require("express");
const path = require("path");
const flash = require("connect-flash");
const app = express();
const bodyParser = require("body-parser");
const { Pool } = require('pg');
const port = process.env.PORT || 8000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

app.use(
  bodyParser.json({
    extended: true
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use(flash());

require("./config/session")(app);

app.set("view engine", "ejs");

var routes_setter = require("./config/routes.js");
routes_setter(app);

app.listen(port, function () {
  console.log("Listening on", port);
});
