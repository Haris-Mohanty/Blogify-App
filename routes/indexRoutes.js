const express = require("express");

const route = express.Router();

//Get Request
route.get("/", (req, res) => {
  res.render("index");
});

module.exports = route;
