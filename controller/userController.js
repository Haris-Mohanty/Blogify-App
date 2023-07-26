const tokenService = require("../services/tokenService");
const dataBase = require("../services/database");
const createUser = async (req, res) => {
  const token = await tokenService.verifyToken(req);
  if (token.isVerified) {
    dataBase.createRecord(token.data);
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
