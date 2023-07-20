const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.json({
    message: "Company API Requested!",
  });
});

module.exports = router;
