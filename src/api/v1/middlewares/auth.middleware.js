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

const authenticateRider = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const decodedToken = parseJWT(token);
    if (!decodedToken) {
      return unauthorized(res, "Invalid token");
    }

    const exp = decodedToken.exp;
    const daysToExpire = dateDifference(exp);

    jwt.verify(token, riderPublicKey, verifyOptions, (err, decoded) => {
      if (err) {
        return unauthorized(res, "Invalid token");
      }
      let shouldChange = false;

      if (daysToExpire <= 2) {
        const newToken = generateRiderToken(decoded);
        shouldChange = true;
        res.setHeader(shouldChange, newToken); // Send the new token in the response header
      }

      req.user = decoded;
      next();
    });
  } else {
    return forbidden(res, "Token not found!");
  }
};

module.exports = {
  authenticateRider,
  generateRiderToken,
  dateDifference,
};
