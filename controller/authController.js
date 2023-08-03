const tokenService = require("../services/tokenService");
const dataBase = require("../services/database");

//Refresh token
const refreshToken = (uid,req) => {
  console.log(uid)
};

const checkUserLogged = async (req) => {
  const tokenData = tokenService.verifyToken(req);
  if (tokenData.isVerified) {
    const query = {
      token: req.cookies.authToken,
      islogged: true,
    };

    const userData = await dataBase.getRecordByQuery(query, "userSchema");
    if (userData.length > 0) {
      refreshToken(tokenData.data, req);
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

module.exports = {
  checkUserLogged: checkUserLogged,
};
