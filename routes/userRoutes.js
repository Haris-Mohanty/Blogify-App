const express = require("express");

const route = express.Router();
const userController = require("../controller/userController");

//Get Request
route.post("/", (req, res) => {
  userController.createUser(req);
});

module.exports = route;
