//****** SEND EMAIL (TO STUDENT) ****/
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.send("SUCCESS");
});

module.exports = router;
