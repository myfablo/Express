


const moment = require("moment-timezone");
const crypto = require("crypto");
const uploadOnCloudinary = require("./cloudinary.helper.js");
const {badRequest} = require("./response.helper.js")


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
  const getTimeInIST =  () => {
    try {
      //now we have to take time in ist format
      let time;
      time = moment().tz("Asia/kolkata")//.format("MMMM Do YYYY, h:mm:ss a");
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

module.exports = {generateRandomBytes,getTimeInIST,uploadImage}