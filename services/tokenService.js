const jwt = require("jsonwebtoken");

require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

const create = (req, expiresIn) => {
  const formData = req.body;
  const endPoint = req.get("origin");
  const api = req.originalUrl;
  const iss = endPoint + api;
  jwt.sign(
    {
      iss: iss,
      data: formData,
    },
    secretKey,
    { expiresIn: expiresIn }
  );
};

const verify = () => {};

module.exports = {
  createToken: create,
  verifyToken: verify,
};
