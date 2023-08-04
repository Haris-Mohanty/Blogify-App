const express = require("express");
const router = express.Router();

//create routes || end point
router.get("/", (req, res) => {
  res.json("Logout REquested!");
});

module.exports = router;
