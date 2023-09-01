const express = require("express");
const exportController = require("../controller/exportController");
const router = express.Router();

router.post("/", (req, res) => {
  exportController.pdf(req, res);
});

module.exports = router;
