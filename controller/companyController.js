const tokenService = require("../services/tokenService");
const createCompany = (req, res) => {
  const token = tokenService.verifyToken(req);
  console.log(token);
};

module.exports = {
  createCompany: createCompany,
};
