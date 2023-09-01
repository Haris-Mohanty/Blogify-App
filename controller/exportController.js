const tokenService = require("../services/tokenService");
const pdf = (req, res) => {
  let token = tokenService.verifyToken(req);
};

module.exports = {
  pdf: pdf,
};
