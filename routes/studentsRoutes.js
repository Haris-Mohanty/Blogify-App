const express = require("express");
const router = express.Router();
const studentsController = require("../controller/studentsController");

router.get("/", (req, res) => {
  res.render("students"); //pug file name
});

router.post("/", (req, res) => {
  studentsController.create(req, res);
});

module.exports = router;
