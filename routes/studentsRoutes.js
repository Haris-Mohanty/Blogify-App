const express = require("express");
const router = express.Router();
const studentsController = require("../controller/studentsController");

router.get("/", (req, res) => {
  res.render("students"); //pug file name
});

router.get("/count-all", (req, res) => {
  studentsController.countStudent(req, res);
});

//***** PAGINATE *****/
router.get("/:from/:to", (req, res) => {
  studentsController.paginate(req, res);
});

//******* CREATE STUDENT *****/
router.post("/", (req, res) => {
  studentsController.create(req, res);
});

//**** DELETE STUDENT *****/
router.delete("/:id", (req, res) => {
  studentsController.deleteStudents(req, res);
});

//******* UPDATE STUDENT ******/
router.put("/:id", (req, res) => {
  studentsController.updateStudents(req, res);
});

module.exports = router;
