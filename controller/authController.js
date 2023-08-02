const tokenService = require("../services/tokenService");
const dataBase = require("../services/database");
const checkUserLogged = async (req) => {
  const tokenData = tokenService.verifyToken(req);
  if (tokenData.isVerified) {
    const query = {
      token: req.cookies.authToken,
      islogged: true,
    };

    const userData = await dataBase.getRecordByQuery(query, "userSchema");
    console.log(userData);
  } else {
    return false;
  }
};

module.exports = {
  checkUserLogged: checkUserLogged,
};
