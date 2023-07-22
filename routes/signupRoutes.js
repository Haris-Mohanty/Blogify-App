require("dotenv").config();
const express = require("express");
const router = express.Router();

const superTest = require("supertest");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const tokenService = require("../services/tokenService");

router.post("/", (req, res) => {
  let expiresIn = 120;
  tokenService.createToken(req, expiresIn);
});

module.exports = router;
