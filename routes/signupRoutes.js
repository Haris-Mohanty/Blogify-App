require("dotenv").config();
const express = require("express");
const router = express.Router();

const tokenService = require("../services/tokenService");
const httpService = require("../services/httpService");

router.post("/", async (req, res) => {
  let expiresIn = 120;
  const token = await tokenService.createToken(req, expiresIn);
  httpService.postRequest(token);
});

module.exports = router;
