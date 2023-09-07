const express = require("express");
const exportController = require("../controller/exportController");
const router = express.Router();

router.post("/", (req, res) => {
  exportController.pdf(req, res);
});

//Delete pdf
router.delete("/:filename", (req, res) => {
  exportController.deletePdf(req, res);
});

module.exports = router;
