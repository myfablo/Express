const moment = require("moment-timezone");
const crypto = require("crypto");
const { generateKeyPairSync } = require("crypto");
const uploadOnCloudinary = require("./cloudinary.helper.js");
const { badRequest } = require("./response.helper.js");
const fs = require("fs").promises;

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

// Generate public and private keys
const generateKeys = async (role) => {
  try {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    await fs.writeFile(`${role}_public_key.pem`, publicKey);
    await fs.writeFile(`${role}_private_key.pem`, privateKey);

    return { publicKey, privateKey };
  } catch (error) {
    console.error(`Some error occurred while generating keys for ${role}: ${error}`);
    throw new Error(`Error generating keys for ${role}`);
  }
};

// Wrapper functions for generating keys for different roles
const generateRiderPublicPrivateKeys = () => generateKeys("rider");
const generateAdminPublicPrivateKeys = () => generateKeys("admin");
const generateUserPublicPrivateKeys = () => generateKeys("user");

module.exports = {
  generateRandomBytes,
  getTimeInIST,
  uploadImage,
  generateRiderPublicPrivateKeys,
  generateAdminPublicPrivateKeys,
  generateUserPublicPrivateKeys,
};
