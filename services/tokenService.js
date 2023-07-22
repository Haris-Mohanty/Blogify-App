const jwt = require("jsonwebtoken");
const issService = require("../services/issService");

require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

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

const verify = (req) => {
  const token = req.body.token;
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
};
