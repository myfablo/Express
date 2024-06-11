const moment = require("moment-timezone");
const { format } = require("date-fns");
const crypto = require("crypto");
const { generateKeyPairSync } = require("crypto");
const uploadOnCloudinary = require("./cloudinary.helper.js");
const { badRequest } = require("./response.helper.js");
const fs = require("fs").promises;
const path = require("path");


//checking if the rider has already been checkIn or not
const isSameDayCheckIn = (existingCheckInData, currentDateString) => {
  if (!existingCheckInData.checkIn || !existingCheckInData.checkIn.checkInTime) return false;
  const existingCheckInDate = new Date(existingCheckInData.checkIn.checkInTime);
  const formattedExistingCheckInDate = format(existingCheckInDate, "MMMM-do-yyyy");
  return formattedExistingCheckInDate === currentDateString;
};

//checking if the rider has already been checkOut or not
const isSameDayCheckOut = (existingData, currentDateString) => {
  if (!existingData.checkOut || !existingData.checkOut.checkOutTime) return false;
  const existingCheckOutDate = new Date(existingData.checkOut.checkOutTime);
  const formattedExistingCheckOutDate = format(existingCheckOutDate, "MMMM-do-yyyy");
  return formattedExistingCheckOutDate === currentDateString;
};



//getting the time difference between checkOut and checkIn of a rider
const getTimeDifference = async (checkInTime, checkOutTime) => {
  try {
    if (!(isSameDayCheckOut && isSameDayCheckIn)) {
      return { status: false, message: "Rider has not been checkedIn or checkedOut on the same day!" }
    }
    // Ensure checkInTime and checkOutTime are instances of Date
    if (!(checkInTime instanceof Date) || !(checkOutTime instanceof Date)) {
      return { status: false, message: "Invalid date format provided" };
    }

    // Calculate time difference
    const timeDifference = checkOutTime.getTime() - checkInTime.getTime();

    // Convert milliseconds to hours, minutes, and seconds
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    const data = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    return data;
    
  } catch (error) {
    console.error(`Error while getting the time differences ${error}`);
    throw new Error("Error while getting the time differences!!");
  }
}


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
  await fs.writeFileSync(path.join(keyDir, `${role}_public_key.pem`), publicKey);
  await fs.writeFileSync(path.join(keyDir, `${role}_private_key.pem`), privateKey);
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
const generateAllKeys = async (role) => {
  if(role == 2){
    await generateKeys(rider);
  }
  else if(role == 0){
    await generateKeys(admin);
  }
  else{
    await generateKeys(user);
  }
  
 
};



// Exporting the key generation function
module.exports = {
  generateAllKeys,
  getTimeInIST,
  uploadImage,
  isSameDayCheckIn,
  isSameDayCheckOut,
  getTimeDifference,
}