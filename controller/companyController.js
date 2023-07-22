const tokenService = require("../services/tokenService");
const dataBase = require("../services/database");

const createCompany = async (req, res) => {
  const token = tokenService.verifyToken(req);

  if (token) {
    const data = token.data;
    try {
      const dataRes = await dataBase.createRecord(data);
      console.log(dataRes);
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(401);
    res.json({
      message: "Permission Denied!",
    });
  }
};

module.exports = {
  createCompany: createCompany,
};
