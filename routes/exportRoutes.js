const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  exportController.pdf(req, res);
});

module.exports = router;
