const express = require("express");
const router = express.Router();
const studentController = require("../controller/studentsController");

router.get("/", (req, res) => {
  res.render("students"); //pug file name
});

router.post("/", (req, res) => {
  
});

module.exports = router;
