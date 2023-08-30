const tokenService = require("../services/tokenService");
const dataBase = require("../services/database");

const createCompany = async (req, res) => {
  const token = tokenService.verifyToken(req);

  if (token) {
    const data = token.data;
    try {
      const dataRes = await dataBase.createRecord(data, "companySchema");
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

const getCompanyId = async (req, res) => {
  const token = await tokenService.verifyToken(req);
  if (token.isVerified) {
    //Get email
    const query = {
      email: token.data.email,
    };
    const companyRes = await dataBase.getRecordByQuery(query, "companySchema");
    if (companyRes.length > 0) {
      res.status(200);
      res.json({
        isCompanyExists: true,
        message: "Company Found Successfully!",
        data: companyRes,
      });
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
      message: "Permission Denied!",
    });
  }
};

//****** COMPANY LOGO UPDATE ******/
const updateCompanyData = async (req, res) => {
  const token = await tokenService.verifyToken(req);
  if (token.isVerified) {
    const id = req.params.id;
    const data = req.body;
    try {
      const dataRes = await dataBase.updateById(id, data, "companySchema");
      res.status(200).json({
        message: "Update Success!",
        data: dataRes,
      });
    } catch (err) {
      res.status(424).json({
        message: "Update Failed!",
        err,
      });
    }
  } else {
    res.status(401).json({
      message: "Permission Denied!",
    });
  }
};

module.exports = {
  createCompany: createCompany,
  getCompanyId: getCompanyId,
  updateCompanyData: updateCompanyData,
};
