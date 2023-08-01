const jwt = require("jsonwebtoken");
const issService = require("../services/issService");

require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

//
const create = async (req, expiresIn) => {
  const formData = req.body;
  const endPoint = req.get("origin");
  const api = req.originalUrl;
  const iss = endPoint + api;
  const token = await jwt.sign(
    {
      iss: iss,
      data: formData,
    },
    secretKey,
    { expiresIn: expiresIn }
  );
  return token;
};

const createCustomToken = async (data, expiresIn) => {
  const formData = data.body;
  const endPoint = data.endPoint;
  const api = data.originalUrl;
  const iss = endPoint + api;
  const token = await jwt.sign(
    {
      iss: iss,
      data: formData,
    },
    secretKey,
    { expiresIn: expiresIn }
  );
  return token;
};

const verify = (req) => {
  let token = "";
  if (req.method == "GET") {
    console.log(req.cookies.authToken)
    token = req.headers["x-auth-token"];
  } else {
    token = req.body.token;
  }
  if (token) {
    try {
      const tmp = jwt.verify(token, secretKey);
      const reqCommingFrom = tmp.iss;
      if (issService.indexOf(reqCommingFrom) != -1) {
        return {
          isVerified: true,
          data: tmp.data,
        };
      } else {
        return {
          isVerified: false,
        };
      }
    } catch (err) {
      return {
        isVerified: false,
      };
    }
  } else {
    return {
      isVerified: false,
    };
  }
};

module.exports = {
  createToken: create,
  verifyToken: verify,
  createCustomToken: createCustomToken,
};
