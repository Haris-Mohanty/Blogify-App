const tokenService = require("../services/tokenService");
const checkUserLogged = async (req) => {
  const tokenData = tokenService.verifyToken(req);
  if(tokenData.isVerified){
    
  }
};

module.exports = {
  checkUserLogged: checkUserLogged,
};
