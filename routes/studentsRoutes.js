const express = require("express");
const router = express.Router();
const studentsController = require("../controller/studentsController");

router.get("/", (req, res) => {
  res.render("students"); //pug file name
});

router.get("/count-all", (req, res) => {
  studentsController.countStudent(req, res);
});

router.get("/:from/:to", (req, res) => {
  studentsController.paginate(req, res);
});

router.post("/", (req, res) => {
  studentsController.create(req, res);
});

module.exports = router;
