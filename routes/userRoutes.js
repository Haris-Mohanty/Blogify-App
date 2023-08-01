const express = require("express");

const route = express.Router();
const userController = require("../controller/userController");

//Get Request
route.post("/", (req, res) => {
  userController.createUser(req, res);
});

route.get("/:query", (req, res) => {
  userController.getUserPassword(req, res);
});

//Update token
route.put("/:id", (req, res) => {
  userController.createLog(req, res);
});

module.exports = route;
