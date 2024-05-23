const fs = require("fs");
const jwt = require("jsonwebtoken");
const { forbidden, unauthorized } = require("../helpers/response.helper.js");

const riderPrivateKey = fs.readFileSync(
  "./key/rider/rider_private_key.pem",
  "utf-8"
); //here we to add the path of the file
const riderPublicKey = fs.readFileSync(
  "./key/rider/rider_public_key.pem",
  "utf-8"
);

const signOptions = { expiresIn: "30d", algorithm: "RS256" };
const verifyOptions = { algorithms: ["RS256"] };

const generateRiderToken = (user) => {
  const data = {
    riderId: user.riderId,
    role: 0,
  };
  return jwt.sign(data, riderPrivateKey, signOptions);
};

const dateDifference = (expireDate) => {
  let tokenDate = new Date(expireDate * 1000);
  let todayDate = new Date();
  let difference = tokenDate.getTime() - todayDate.getTime();
  let dayDifference = difference / (1000 * 60 * 60 * 24);
  return dayDifference;
};

const parseJwt = (data) => {
  try {
    let token = data.slice(7);
    const decode = Buffer.from(token.split(".")[1], "base64");
    const toString = decode.toString();
    return JSON.parse(toString);
  } catch (e) {
    return null;
  }
}
const authenticateRider = (req, res, next) => {
  let authHeader = req.headers.authorization;
  const decode = parseJwt(authHeader)
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      verifyToken(token, riderPublicKey, verifyOptions, decode, res)
      next();
    } catch (err) {
      console.log(err);
      unauthorized(res, "invalid token");
    }
  } else {
    forbidden(res, "token not found");
  }
}


const verifyToken = (token, publicKey, verifyOptions, decode, res) => {
  try {
    jwt.verify(token, publicKey, verifyOptions);
    let shouldChange = false
    const dateDiff = dateDifference(decode.exp)
    if (dateDiff <= 2) {
      token = generateRiderToken(decode.role, decode)
      shouldChange = true
    }
    res.tokenInfo = { token, shouldChange }
    return
  } catch (error) {
    console.log(error);
    throw new Error(error.message)
  }
}

module.exports = {
  authenticateRider,
  generateRiderToken,
  parseJwt,
};
