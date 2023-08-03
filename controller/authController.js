const tokenService = require("../services/tokenService");
const dataBase = require("../services/database");

//Refresh token
const refreshToken = async (uid, req) => {
  const endPoint = req.get("origin") || "http://" + req.get("host");
  const option = {
    body: uid,
    endPoint: endPoint,
    originalUrl: req.originalUrl,
  };

  const expiresIn = 86400;
  const newToken = await tokenService.createCustomToken(option, expiresIn);
  const updateToken = {
    token: newToken,
    expiresIn: expiresIn,
    updatedAt: Date.now(),
  };
  await dataBase.updateByQuery(uid, "userSchema", updateToken);
  return newToken;
};

const checkUserLogged = async (req, res) => {
  const tokenData = tokenService.verifyToken(req);
  if (tokenData.isVerified) {
    const query = {
      token: req.cookies.authToken,
      islogged: true,
    };

    const userData = await dataBase.getRecordByQuery(query, "userSchema");
    if (userData.length > 0) {
      const newToken = await refreshToken(tokenData.data, req);
      res.cookie("authToken", newToken, { maxAge: 86400 * 1000 });
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
