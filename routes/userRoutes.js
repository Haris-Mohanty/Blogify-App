const express = require("express");

const route = express.Router();

//Get Request
route.post("/", (req, res) => {
  res.send("Success");
});

module.exports = route;
