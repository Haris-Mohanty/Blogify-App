const express = require("express");
const router = express.Router();

//routes create
router.get("/", (req, res) => {
  res.render("profile");
});

module.exports = router;
