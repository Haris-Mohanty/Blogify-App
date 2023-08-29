const tokenService = require("../services/tokenService");
const dataBase = require("../services/database");

const createUser = async (req, res) => {
  const token = await tokenService.verifyToken(req);
  if (token.isVerified) {
    try {
      //When user signup, redirect to profile page
      const uidJson = {
        uid: token.data.uid,
        companyInfo: token.data.companyInfo,
      };
      const endPoint = req.get("origin") || "http://" + req.get("host");
      const option = {
        body: uidJson,
        endPoint: endPoint,
        originalUrl: req.originalUrl,
      };
      
      const expiresIn = 86400;
      const newToken = await tokenService.createCustomToken(option, expiresIn);
      token.data["token"] = newToken;
      token.data["expiresIn"] = expiresIn;
      token.data["islogged"] = true;

      //user respone
      const userRes = await dataBase.createRecord(token.data, "userSchema");
      res.status(200);
      res.json({
        token: newToken,
        isUserCreated: true,
        message: "User Created Successfully!",
      });
    } catch (err) {
      res.status(500);
      res.json({
        isUserCreated: false,
        message: "Internal Server Error!",
      });
    }
  } else {
    res.status(401);
    res.json({
      message: "Permission Denied!",
    });
  }
};

const getUserPassword = async (req, res) => {
  const token = await tokenService.verifyToken(req);
  if (token.isVerified) {
    const userData = token.data;
    const query = {
      uid: userData.uid,
    };
    const dataRes = await dataBase.getRecordByQuery(query, "userSchema");

    if (dataRes.length > 0) {
      res.status(200);
      res.json({
        isCompanyExists: true,
        message: "Company Found!",
        data: dataRes,
      });

      //
    } else {
      res.status(404);
      res.json({
        isCompanyExists: false,
        message: "Company Not Found!",
      });
    }
  } else {
    res.status(401);
    res.json({
      message: "Unauthenticated User!",
    });
  }
};

const createLog = async (req, res) => {
  const token = await tokenService.verifyToken(req);
  if (token.isVerified) {
    //Data macth
    const query = {
      uid: token.data.uid,
    };
    //Data upadte
    const data = {
      token: req.body.token,
      expiresIn: 86400, //1 days in sec
      islogged: true,
      updatedAt: Date.now(),
    };
    const userRes = await dataBase.updateByQuery(query, "userSchema", data);
    res.status(201).json({
      message: "Token Updated Successfully!",
    });
  } else {
    res.status(401).json({
      message: "Permission Denied!",
    });
  }
};

module.exports = {
  createUser: createUser,
  getUserPassword: getUserPassword,
  createLog: createLog,
};
