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

module.exports = {
  createUser: createUser,
};
