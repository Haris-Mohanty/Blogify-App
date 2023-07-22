const tokenService = require("../services/tokenService");
const dataBase = require("../services/database");

const createCompany = async (req, res) => {
  const token = tokenService.verifyToken(req);

  if (token) {
    const data = token.data;
    try {
      const dataRes = await dataBase.createRecord(data);
      res.status(200);
      res.json({
        isCompanyCreated: true,
        message: "Company Created Successfully!",
        data: dataRes,
      });
    } catch (err) {
      res.status(409);
      res.json({
        isCompanyCreated: false,
        message: err,
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
  createCompany: createCompany,
};
