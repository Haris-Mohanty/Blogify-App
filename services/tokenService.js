const jwt = require("jsonwebtoken");

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

const verify = () => {};

module.exports = {
  createToken: create,
  verifyToken: verify,
};
