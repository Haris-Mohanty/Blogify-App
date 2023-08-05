const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("students"); //pug file name
});

module.exports = router;
