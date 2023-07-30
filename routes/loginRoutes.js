const express = require("express");
const router = express.Router();
const tokenService = require("../services/tokenService");
const httpService = require("../services/httpService");
const bcryptService = require("../services/bcryptService");

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
    const query = {
      body: {
        uid: uid,
      },
      endPoint: req.get("origin"),
      originalUrl: req.originalUrl,
    };

    const uidToken = await tokenService.createCustomToken(query, expiresIn);
    //Get user res
    const userRes = await httpService.getRequest({
      endPoint: req.get("origin"),
      api: "/api/private/user",
      data: uidToken,
    });
    //Get user password
    if (userRes.isCompanyExists) {
      const realPassword = userRes.data[0].password;
      const islogged = await bcryptService.dcrypt(
        realPassword,
        req.body.password
      );
      res.json(islogged);
    }
  } else {
    res.json(companyRes);
  }
});

module.exports = router;
