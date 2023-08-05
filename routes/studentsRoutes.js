const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("students");
});

module.exports = router;
