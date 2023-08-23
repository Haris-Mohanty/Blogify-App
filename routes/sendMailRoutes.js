//****** SEND EMAIL (TO STUDENT) ****/
const express = require("express");
const sendMailController = require("../controller/sendMailController");
const router = express.Router();

router.post("/", (req, res) => {
  sendMailController.sendEmail(req, res);
});

module.exports = router;
