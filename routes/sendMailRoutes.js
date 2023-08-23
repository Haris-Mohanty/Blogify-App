//****** SEND EMAIL (TO STUDENT) ****/
const express = require("express");
const { sendEmail } = require("../controller/sendMailController");
const router = express.Router();

router.post("/", (req, res) => {
  sendEmail.sendEmail(req, res);
});

module.exports = router;
