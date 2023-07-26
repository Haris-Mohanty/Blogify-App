const express = require("express");
const router = express.Router();
const companyController = require("../controller/companyController");

router.post("/", (req, res) => {
  companyController.createCompany(req, res);
});

router.get("/:query", (req, res) => {
  console.log(req.params.query);
});

module.exports = router;
