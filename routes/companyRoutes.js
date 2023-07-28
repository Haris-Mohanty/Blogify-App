const express = require("express");
const router = express.Router();
const companyController = require("../controller/companyController");

router.post("/", (req, res) => {
  companyController.createCompany(req, res);
});

router.get("/:query", (req, res) => {
  companyController.getCompanyId(req, res);
});
module.exports = router;
