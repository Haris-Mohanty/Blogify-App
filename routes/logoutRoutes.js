const express = require("express");
const authController = require("../controller/authController");
const router = express.Router();

//create routes || end point
router.get("/", (req, res) => {
  authController.logout(req, res);
});

module.exports = router;
