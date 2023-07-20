require("dotenv").config();
const express = require("express");
const router = express.Router();

const superTest = require("supertest");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

router.post("/", (req, res) => {
  const fromData = req.body;
  const token = jwt.sign(
    {
      iss: "",
      data: fromData,
    },
    secretKey,
    { expiresIn: 120 }
  );
  console.log(token);
});

module.exports = router;
