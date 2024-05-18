const moment = require("moment-timezone");
const { crypto, generateKeyPairSync } = require("crypto");
const uploadOnCloudinary = require("./cloudinary.helper.js");
const { badRequest } = require("./response.helper.js");
const fs = require("fs");
const { format } = require("path");

//for generating various ids etc.
const generateRandomBytes = async (length) => {
  try {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(length, (err, buff) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(buff.toString("hex"));
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error while generating the RandomByte!!");
  }
};
//for taking time in ist
const getTimeInIST = () => {
  try {
    //now we have to take time in ist format
    let time;
    time = moment().tz("Asia/kolkata"); //.format("MMMM Do YYYY, h:mm:ss a");
    // console.log(time)

    if (!time) {
      return badRequest(res, "checkInTime is not defined");
    }

    return time;
  } catch (error) {
    console.log(error);
    return badRequest(error, "Error while generating the live time!!");
  }
};

//now we have to upload image on cloudinary thru multer
const uploadImage = async (localFilePath) => {
  try {
    const cloudinaryFilePath = await uploadOnCloudinary(localFilePath);
    console.log(cloudinaryFilePath.url);
    if (!cloudinaryFilePath) {
      return badRequest(
        "Error uploading the check-in image file to Cloudinary"
      );
    }
    return cloudinaryFilePath;
  } catch (error) {
    console.log(error);
    return badRequest(error, " Failed to upload the file to cloudinary!!");
  }
};

//now we have to generate the public and private key to for authentication purposes!!
const generatePublicPrivateKeys = async () => {
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
    fs.writeFileSync("rider_public_key.pem", publicKey);
    fs.writeFileSync("rider_private_key.pem", privateKey);
    console.log(privateKey, publicKey);
    return { publicKey, privateKey };
  } catch (error) {
    console.error(`Some error occured while generating keys : ${error}`);
  }
};

module.exports = {
  generateRandomBytes,
  getTimeInIST,
  uploadImage,
  generatePublicPrivateKeys,
};
