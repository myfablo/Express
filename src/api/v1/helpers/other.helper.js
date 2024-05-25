const moment = require("moment-timezone");
const crypto = require("crypto");
const { generateKeyPairSync } = require("crypto");
const uploadOnCloudinary = require("./cloudinary.helper.js");
const { badRequest } = require("./response.helper.js");
const fs = require("fs").promises;
const path = require("path");

// Generate random bytes
const generateRandomBytes = async (length) => {
  try {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(length, (err, buff) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        resolve(buff.toString("hex"));
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error while generating the RandomByte!!");
  }
};

// Get time in IST
const getTimeInIST = () => {
  try {
    const time = moment().tz("Asia/Kolkata");
    if (!time) throw new Error("checkInTime is not defined");

    return time.format("MMMM-Do-YYYY, h:mm:ss");
  } catch (error) {
    console.error(error);
    throw new Error("Error while generating the live time!!");
  }
};

// Upload image to Cloudinary
const uploadImage = async (localFilePath) => {
  try {
    const cloudinaryFilePath = await uploadOnCloudinary(localFilePath);
    if (!cloudinaryFilePath) {
      throw new Error("Error uploading the check-in image file to Cloudinary");
    }
    console.log(cloudinaryFilePath.url);
    return cloudinaryFilePath;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to upload the file to Cloudinary!!");
  }
};

// Utility to create directories and write keys
const saveKeys = async (role, publicKey, privateKey) => {
  const keyDir = path.join("../key", role);
  
  // Ensure the directory exists
  await fs.mkdir(keyDir, { recursive: true });

  // Write the keys
  await fs.writeFile(path.join(keyDir, `${role}_public_key.pem`), publicKey);
  await fs.writeFile(path.join(keyDir, `${role}_private_key.pem`), privateKey);
};

// Generate keys for a role
const generateKeys = async (role) => {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "pkcs1", format: "pem" },
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
  });

  await saveKeys(role, publicKey, privateKey);
  return { publicKey, privateKey };
};

// Generate keys for all roles
const generateAllKeys = async () => {
  await generateKeys('rider');
  await generateKeys('admin');
  await generateKeys('user');
};

// Load keys asynchronously
const loadKey = async (role, type) => {
  const filePath = path.join("key", role, `${role}_${type}_key.pem`);
  return await fs.readFile(filePath, 'utf-8');
};

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
};

// Load all keys at once
const keysPromise = loadKeys();

// Exporting the key generation function
module.exports = {
  generateAllKeys,
  loadKeys,

  generateRandomBytes,
  getTimeInIST,
  uploadImage,

}