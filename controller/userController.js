const tokenService = require("../services/tokenService");
const dataBase = require("../services/database");
const createUser = async (req, res) => {
  const token = await tokenService.verifyToken(req);
  if (token.isVerified) {
    try {
      const userRes = await dataBase.createRecord(token.data, "userSchema");
      res.status(200);
      res.json({
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
    const query = token.data;
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
    console.log("Accepted");
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
