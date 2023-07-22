require("dotenv").config();
const express = require("express");
const router = express.Router();

const tokenService = require("../services/tokenService");
const httpService = require("../services/httpService");

router.post("/", async (req, res) => {
  let expiresIn = 120;
  const token = await tokenService.createToken(req, expiresIn);
  const companyRes = await httpService.postRequest({
    endPoint: req.get("origin"),
    api: "/api/private/company",
    data: token,
  });
  //Requesting User API
  if (companyRes.isCompanyCreated) {
    
  } else {
    res.json(companyRes);
  }
});

module.exports = router;
