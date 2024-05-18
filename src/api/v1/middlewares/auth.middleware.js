const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { forbidden, unauthorized } = require("../helpers/response_helper");

const riderPrivateKey = fs.readFileSync("path");
const riderPublicKey = fs.readFileSync("path");

const signOption = { expiresIn: "30 days", algorithm: "RS256" };
const verifyOption = { expiresIn: "30 days", algorithm: "RS256" };

const generateRiderToken = (user) => {
  const data = {
    riderId: user.riderId,
    role: 0,
  };
  return jwt.sign(data, riderPrivateKey, signOption);
};

const authenticateRider = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const decode = parseJwt(authHeader);
  // if(decode.role === 0){
  //     next();
  //     }else{
  //         return res.status(403).json(forbidden("You are not authorized to access this resource"));
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      verifyToken(token, riderPublicKey, verifyOption, decode, res);
      next();
    } catch (error) {
      unauthorized(res, "Invalid token");
    }
  } else {
    forbidden(res, "token not found!");
  }
};

const parseJwt = (data) => {
  try {
    let token = data.slice(7);
    const decode = Buffer.from(token.split(".")[1], "base64");
    const toString = decode.toString();
    return JSON.parse(toString);
  } catch (error) {
    return error;
  }
};

const verifyToken = (token, publicKey, verifyOption, decode, res) => {
  try {
    jwt.verify(token, publicKey, verifyOption);
    let shouldChange = false;
    const dateDiff = dateDifference(decode.exp);
    if (dateDiff <= 2) {
      token = generateTokenFromRole(decode.role, decode);
      shouldChange = true;
    }
    res.tokenInfo = { token, shouldChange };
    return;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const generateTokenFromRole = (role) => {
  switch (role) {
    default:
      return generateRiderToken(userData);
  }
};

const dateDifference = (expireDate) => {
  let tokenDate = new Date(expireDate * 1000);
  let todatDate = new Date();
  let difference = tokenDate.getTime() - todatDate.getTime();
  let dayDifference = difference / (1000 * 60 * 60 * 24);
  return dayDifference;
};

module.exports = {
  dateDifference,
  generateTokenFromRole,
  verifyToken,
  parseJwt,
  authenticateRider,
  generateRiderToken,
  generateGuestToken,
};
