require("dotenv").config();
const express = require("express");
const router = express.Router();

const superTest = require("supertest");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const tokenService = require("../services/tokenService");

router.post("/", async (req, res) => {
  let expiresIn = 120;
  const token = await tokenService.createToken(req, expiresIn);
  console.log(token);
});

module.exports = router;
