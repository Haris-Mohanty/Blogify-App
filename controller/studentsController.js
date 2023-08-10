const tokenService = require("../services/tokenService");
const dataBase = require("../services/database");

const create = async (req, res) => {
  //Token Verify
  const tokenData = await tokenService.verifyToken(req);
  if (tokenData.isVerified) {
    const data = req.body;
    data["companyId"] = tokenData.data.uid;
    //data insert in database
    try {
      const dataRes = await dataBase.createRecord(data, "studentSchema");
      res.status(200).json({
        message: "Record Created!",
        data: dataRes,
      });
    } catch (err) {
      res.status(409).json({
        message: "Error in Create API!",
        error: err,
      });
    }
  } else {
    res.status(401).json({
      message: "Permission Denied!",
    });
  }
};

module.exports = {
  create: create,
};
