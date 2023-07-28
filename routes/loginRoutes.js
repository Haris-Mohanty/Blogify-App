const express = require("express");
const router = express.Router();
const tokenService = require("../services/tokenService");
const httpService = require("../services/httpService");

router.post("/", async (req, res) => {
  let expiresIn = 120;
  const token = await tokenService.createToken(req, expiresIn);
  //Get company ID
  const companyRes = await httpService.getRequest({
    endPoint: req.get("origin"),
    api: "/api/private/company",
    data: token,
  });
  //User id get
  if (companyRes.isCompanyExists) {
    const uid = companyRes.data[0]._id;
    console.log(uid)
  } else {
    res.json(companyRes);
  }
});

module.exports = router;
