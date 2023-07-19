const express = require("express");

const router = express.Router();

router.post("/", (req, res) => {
  res.json({
    message: "Success",
    data: req.body,
  });
});

module.exports = router;
