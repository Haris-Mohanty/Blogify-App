const tokenService = require("../services/tokenService");
const dataBase = require("../services/database");

const create = (req, res) => {
  //Token Verify
  const tokenData = tokenService.verifyToken(req);
  if (tokenData.isVerified) {
    
  } else {
    res.status(401).json({
      message: "Permission Denied!",
    });
  }
};

module.exports = {
  create: create,
};
