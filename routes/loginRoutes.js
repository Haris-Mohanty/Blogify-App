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
        companyInfo: companyRes.data[0],
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
    if (userRes.isCompanyExists) {
      //Allow Single Device Login
      // if (userRes.data[0].islogged) {
      //   res.status(406).json({
      //     message:
      //       "User Already login on Another Device, Pls Logout user from other device to Login!",
      //   });
      //   return false;
      // }

      //Get user password
      const realPassword = userRes.data[0].password;
      const islogged = await bcryptService.dcrypt(
        realPassword,
        req.body.password
      );

      //*****  REDIRECT TO PROFILE PAGE ******/
      if (islogged) {
        //Generate token
        const oneDaysInSecond = 86400;
        const authToken = await tokenService.createCustomToken(
          query,
          oneDaysInSecond
        );

        //Store Token In Database
        const dbToken = await httpService.putRequest({
          endPoint: req.get("origin"),
          api: "/api/private/user",
          data: authToken,
        });

        //Set Cookie
        res.cookie("authToken", authToken, { maxAge: oneDaysInSecond * 1000 }); //Cokkie stores data in milisecond(so 1000 multiply)
        res.status(200).json({
          islogged: true,
          message: "Success",
        });
      } else {
        res.status(401).json({
          islogged: false,
          message: "Wrong Password!",
        });
      }
    } else {
      res.status(userRes.status);
      res.json(userRes);
    }
  } else {
    res.status(404);
    res.json(companyRes);
  }
});

module.exports = router;
