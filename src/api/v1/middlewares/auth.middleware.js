const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const path = require("path");
const { forbidden, unauthorized } = require("../helpers/response.helper.js");



// Load keys asynchronously
const loadKey = async (role, type) => {
  const filePath = path.join("key", role, `${role}_${type}_key.pem`);
  return await fs.readFile(filePath, 'utf-8');
};

//load keys for specific role
const loadKeys = async () => {
  const roles = ['rider', 'admin', 'user'];
  const keys = {};
  for (const role of roles) {
    keys[role] = {
      privateKey: await loadKey(role, 'private'),
      publicKey: await loadKey(role, 'public')
    };
  }
  return keys;
  console.log(keys)
};

// Load all keys at once
const keysPromise = loadKeys();
console.log(keysPromise)

// JWT options
const signOptions = { expiresIn: "30d", algorithm: "RS256" };
const verifyOptions = { algorithms: ["RS256"] };

// Generate tokens
const generateToken = (user, role) => {
  const data = { [`${role}Id`]: user[`${role}Id`], role: getRoleCode(role) };
  return jwt.sign(data, keys[role].privateKey, signOptions);
};

const getRoleCode = (role) => {
  const roleCodes = { admin: 0, rider: 1, user: 2 };
  return roleCodes[role];
};

// Date difference calculation
const dateDifference = (expireDate) => {
  const tokenDate = new Date(expireDate * 1000);
  const todayDate = new Date();
  const difference = tokenDate - todayDate;
  return difference / (1000 * 60 * 60 * 24);
};

// Parse JWT
const parseJwt = (data) => {
  try {
    const token = data.slice(7);
    const decode = Buffer.from(token.split(".")[1], "base64").toString();
    return JSON.parse(decode);
  } catch (e) {
    return null;
  }
};

// Verify token and refresh if needed
const verifyToken = (token, publicKey, decode, res) => {
  try {
    jwt.verify(token, publicKey, verifyOptions);
    const shouldChange = dateDifference(decode.exp) <= 2;
    if (shouldChange) {
      token = generateToken(decode, getRoleFromCode(decode.role));
    }
    res.tokenInfo = { token, shouldChange };
  } catch (error) {
    console.error(error);
    throw new Error("Invalid token");
  }
};

// Get role from code
const getRoleFromCode = (code) => {
  const roles = ["admin", "rider", "user"];
  return roles[code];
};



// Role-specific authentication
const authenticateRole = (role) => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return forbidden(res, "Token not found");

  const token = authHeader.split(" ")[1];
  const decode = parseJwt(authHeader);
  if (!decode || decode.role !== getRoleCode(role)) return unauthorized(res, "Invalid token");

  const keys = await keysPromise;

  try {
    verifyToken(token, keys[role].publicKey, decode, res);
    next();
  } catch (error) {
    unauthorized(res, error.message);
  }
};

// Export functions
module.exports = {
  authenticateUser: authenticateRole('user'),
  authenticateRider: authenticateRole('rider'),
  authenticateAdmin: authenticateRole('admin'),
  generateRiderToken: (user) => generateToken(user, 'rider'),
  generateUserToken: (user) => generateToken(user, 'user'),
  generateAdminToken: (user) => generateToken(user, 'admin'),
  parseJwt,
  generateTokenFromRole: (role, userData) => generateToken(userData, getRoleFromCode(role))
};