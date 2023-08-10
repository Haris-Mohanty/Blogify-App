const tokenService = require("../services/tokenService");
const dataBase = require("../services/database");

const create = (req, res) => {
  //Token Verify
  const tokenData = tokenService.verifyToken(req);
  if (tokenData.isVerified) {
    const data = req.body;
    data["companyId"] = tokenData.data.uid;
    //data insert in database
    dataBase.createRecord(data,"studentSchema");
  } else {
    res.status(401).json({
      message: "Permission Denied!",
    });
  }
};

module.exports = {
  create: create,
};
