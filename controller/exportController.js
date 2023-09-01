const tokenService = require("../services/tokenService");
const pdf = async (req, res) => {
  let token = await tokenService.verifyToken(req);
  if (token.isVerified) {
  } else {
    res.status(401).json({
      message: "Permission Denied at PDF!",
    });
  }
};

module.exports = {
  pdf: pdf,
};
