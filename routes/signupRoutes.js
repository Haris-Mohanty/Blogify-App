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
    const newUser = {
      body: {
        uid: companyRes.data._id,
        password: req.body.password,
      },
      endPoint: req.get("origin"),
      originalUrl: req.originalUrl,
    };
    const userToken = await tokenService.createCustomToken(newUser, expiresIn);

    const userRes = await httpService.postRequest({
      endPoint: req.get("origin"),
      api: "/api/private/user",
      data: userToken,
    });
  } else {
    res.json(companyRes);
  }
});

module.exports = router;
