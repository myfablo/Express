const fs = require("fs");
const jwt = require("jsonwebtoken");
const { forbidden, unauthorized } = require("../helpers/response.helper.js");
const bcrypt = require("bcrypt");



//...........................PRIVATE KEYS................................................................................//
const userPrivateKEY = fs.readFileSync("./key/user/user_private_key.pem", "utf8");
const riderPrivateKEY = fs.readFileSync("./key/rider/rider_private_key.pem", "utf8");
const adminPrivateKEY = fs.readFileSync("./key/admin/admin_private_key.pem", "utf8")

//....................PUBLIC KEYS.......................................................................................//
const riderPublicKEY = fs.readFileSync("./key/rider/rider_public_key.pem", "utf8");
const userPublicKEY = fs.readFileSync("./key/user/user_public_key.pem", "utf8");
const adminPublicKEY = fs.readFileSync("./key/admin/admin_public_key.pem", "utf8")


// JWT options
const signOptions = { expiresIn: "30d", algorithm: "RS256" };
const verifyOptions = { algorithms: ["RS256"] };

//...........................................user-filter...............................................................//
const createAuthToken = (userType, userData) => {
  switch (userType) {
    case "mrWhiteHatHacker":
      return generateAdminToken(userData)
    case "rider":
      return generateRiderToken(userData)
    default:
      return generateUserToken(userData)
  }
}

//.........................................Generate tokens............................................................//
const generateRiderToken = (user) => {
  const data = {
    userId: user.riderId,
    role: 2
  };
  return jwt.sign(data, riderPrivateKEY, signOptions);
};

const generateUserToken = (user) => {
  const data = {
    userId: user.userId,
    role: 1,
  };
  return jwt.sign(data, userPrivateKEY, signOptions);
};

const generateAdminToken = (user) => {
  const data = {
    userId: user.userId,
    role: 0
  };
  return jwt.sign(data, adminPrivateKEY, signOptions);
};

//.....................................Date difference calculation...................................................//
const dateDifference = (expireDate) => {
  const tokenDate = new Date(expireDate * 1000);
  const todayDate = new Date();
  const difference = tokenDate - todayDate;
  return difference / (1000 * 60 * 60 * 24);
};

//...........................................Parse JWT..............................................................//
const parseJwt = (data) => {
  try {
    const token = data.slice(7);
    const decode = Buffer.from(token.split(".")[1], "base64").toString();
    return JSON.parse(decode);
  } catch (e) {
    return null;
  }
};

async function encryption(data) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(data, salt);
  return hash;
}

async function checkEncryption(data, encryptData) {
  const check = await bcrypt.compare(data, encryptData);
  return check;
}


//....................................Verify token and refresh if needed...........................................//
function verifyToken(token, publicKey, verifyOptions, decode, res) {
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



//....................................Role-specific authentication................................................//
function authenticateUser(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const decode = parseJwt(authHeader);
      const token = authHeader.split(" ")[1];
      if (decode.role == 0) {
        verifyToken(token, adminPublicKEY, verifyOptions, decode, res)
         next();
      } else if (decode.role == 2) {
        verifyToken(token, riderPublicKEY, verifyOptions, decode, res)
        next();
      }  else {
       verifyToken(token, userPublicKEY, verifyOptions, decode, res)
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
      const decode = parseJwt(authHeader)
      const token = authHeader.split(" ")[1];
      if (decode.role == 0) {
        verifyToken(token, adminPublicKEY, verifyOptions, decode, res)
        next();
      }  else {
        verifyToken(token, riderPublicKEY, verifyOptions, decode, res)
        next();
      }
    } catch (error) {
      unauthorized(res, "invalid token");
    }
  } else {
    forbidden(res, "token not found");;
  }
}

function authenticateAdmin(req, res, next) {
  let authHeader = req.headers.authorization;
  const decode = parseJwt(authHeader)
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      verifyToken(token, adminPublicKEY, verifyOptions, decode, res)
      next();
    } catch (err) {
      console.log(err);
      unauthorized(res, "invalid token");
    }
  } else {
    forbidden(res, "token not found");
  }
}

//...................................generating token based upon role............................................//
function generateTokenFromRole(role) {
  switch (role) {
    case 0:
      return generateAdminToken(userData)
    case 1:
      return generateUserToken(userData)
    case 2:
      return generateRiderToken(userData)
    default:
      return
  }

}

// Export functions
module.exports = {
  authenticateUser,
  authenticateRider,
  authenticateAdmin,
  createAuthToken,
  generateRiderToken,
  generateUserToken,
  generateAdminToken,
  parseJwt,
  encryption,
  checkEncryption
};













