const fs = require("fs");
const jwt = require("jsonwebtoken");
const { forbidden, unauthorized } = require("../helpers/response.helper.js");


//--------------------------------------------------------private keys--------------------------------------------------------------------------------------------
const riderPrivateKey = fs.readFileSync(
  "./key/rider/rider_private_key.pem",
  "utf-8"
);
const adminPrivateKey = fs.readFileSync(
  "./key/admin/admin_private_key.pem",
  "utf-8"
);
const userPrivateKey = fs.readFileSync(
  "./key/user/user_private_key.pem",
  "utf-8"
);


//----------------------------------------------------------public keys------------------------------------------------------------------------------------------
const riderPublicKey = fs.readFileSync(
  "./key/rider/rider_public_key.pem",
  "utf-8"
);
const adminPublicKey = fs.readFileSync(
  "./key/admin/admin_public_key.pem",
  "utf-8"
);

const userPublicKey = fs.readFileSync(
  "./key/user/user_public_key.pem",
  "utf-8"
);

//--------------------------------------------------options-------------------------------------------------//
const signOptions = { expiresIn: "30d", algorithm: "RS256" };
const verifyOptions = { algorithms: ["RS256"] };



const generateRiderToken = (user) => {
  const data = {
    riderId: user.riderId,
    role: 1,
  };
  return jwt.sign(data, riderPrivateKey, signOptions);
};


const generateUserToken = (user) => {
  const data = {
    userId: user.userId,
    role: 2,
  };
  return jwt.sign(data, userPrivateKey, signOptions);
};


const generateAdminToken = (user) => {
  const data = {
    adminId: user.adminId,
    role: 0,
  };
  return jwt.sign(data, adminPrivateKey, signOptions);
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

function authenticateUser(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const decode = parseJwt(authHeader);
      const token = authHeader.split(" ")[1];
      if (decode.role == 0) {
        verifyToken(token, adminPublicKey, verifyOptions, decode, res)
        next();
      } else if (decode.role == 1) {
        verifyToken(token, riderPublicKey, verifyOptions, decode, res)
        next();
      } else if (decode.role == 2) {
        verifyToken(token, userPublicKey, verifyOptions, decode, res)
        next();
      } else {
        verifyToken(token, userPublicKey, verifyOptions, decode, res)
        next();
      }
    } catch (error) {
      unauthorized(res, "invalid token");
    }
  } else {
    forbidden(res, "token not found");
  }
}

function authenticateRider(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const decode = parseJwt(authHeader);
      const token = authHeader.split(" ")[1];
      if (decode.role == 0) {
        verifyToken(token, adminPublicKey, verifyOptions, decode, res)
        next();
      } else if (decode.role == 2) {
        verifyToken(token, userPublicKey, verifyOptions, decode, res)
        next();
      } else if (decode.role == 1) {
        verifyToken(token, riderPublicKey, verifyOptions, decode, res)
        next();
      } else {
        verifyToken(token, riderPublicKey, verifyOptions, decode, res)
        next();
      }
    } catch (error) {
      unauthorized(res, "invalid token");
    }
  } else {
    forbidden(res, "token not found");
  }
}


function authenticateAdmin(req, res, next) {
  let authHeader = req.headers.authorization;
  const decode = parseJwt(authHeader)
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      verifyToken(token, adminPublicKey, verifyOptions, decode, res)
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
      token = generateTokenFromRole(decode.role, decode)
      shouldChange = true
    }
    res.tokenInfo = { token, shouldChange }
    return
  } catch (error) {
    console.log(error);
    throw new Error(error.message)
  }
}

function generateTokenFromRole(role) {
  switch (role) {
    case 2:
      return generateUserToken(userData)
    case 1:
      return generateRiderToken(userData)
    case 0:
      return generateAdminToken(userData)
    default:
      return generateUserToken()
  }

}

module.exports = {
  authenticateRider,
  generateRiderToken,
  parseJwt,
  generateTokenFromRole,
  authenticateAdmin,
  authenticateUser,


};
