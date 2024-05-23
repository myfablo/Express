const {
  badRequest,
  unknownError,
  alreadyExist,
} = require("./response.helper.js");
const moment = require("moment-timezone");
const { checkInsModel } = require("../models/checkIn.model.js");
const mongoose = require("mongoose");
const { format } = require("date-fns");
const {
  generateRandomBytes,
  getTimeInIST,
  uploadImage,
} = require("./other.helper.js");

//request from controller to checkIn
const addCheckInRequest = async (
  riderId,
  checkInKiloMeters,
  inLocalFilePath
) => {
  try {
    // Take id and time from the separate created function
    const checkInId = await generateRandomBytes(8);
    const Time = getTimeInIST();
    let compareTime = Time.split(",")[0];

    // Take image from the separate created function
    const checkInImage = await uploadImage(inLocalFilePath);

    // Construct data object for check-in
    const data = {
      riderId: riderId,
      checkIn: {
        checkInId: checkInId,
        checkInTime: new Date(),
        checkInImage: checkInImage.url,
        checkInKiloMeters: checkInKiloMeters,
      },
      distance: checkInKiloMeters, // Assuming you want to set distance to checkInKiloMeters
    };
    let checkInData;

    // Checking if there is already a check-in by the same user
    const checkedInData = await checkInsModel.findOne({ riderId: riderId });
    if (
      checkedInData &&
      checkedInData.checkIn &&
      checkedInData.checkIn.checkInTime
    ) {
      let retrievedTime = new Date(checkedInData.checkIn.checkInTime);
      let formattedTime = format(retrievedTime, "MMMM-do-yyyy");

      if (formattedTime === compareTime) {
        return {
          status: false,
          message: "Rider already checkedIn for today!",
        };
      }
    }

    // Save the check-in data
    checkInData = await checkInsModel.create(data);

    console.log(checkInData);

    if (!checkInData) {
      return {
        status: false,
        message: "Failed to save the Check-In Data!!",
      };
    }

    return {
      status: true,
      message: "Check-In Data Saved Successfully!!",
      data: checkInData,
    };
  } catch (error) {
    console.log(error);
    return { status: false, message: error.message, data: error };
  }
};
//request from controller to checkOut

const addCheckOutRequest = async (
  riderId,
  checkInOutId,
  checkOutKiloMeters,
  outLocalFilePath
) => {
  try {
    const checkingOutTime = getTimeInIST();
    const time = checkingOutTime.split(",")[0];

    const checkOutImage = await uploadImage(outLocalFilePath);

    // Checking if the rider has already checked out today
    const checkOutData = await checkInsModel.findOne({
      "checkIn.checkInId": checkInOutId,
    });
    if (
      checkOutData &&
      checkOutData.checkOut &&
      checkOutData.checkOut.checkOutTime
    ) {
      let retrievedTime = new Date(checkOutData.checkOut.checkOutTime);
      let formattedTime = format(retrievedTime, "MMMM-do-yyyy");
      if (time === formattedTime) {
        return {
          status: false,
          message: "You have already checked out today!!",
        };
      }
    }

    // Find the check-in data
    const data = await checkInsModel.findOne({
      "checkIn.checkInId": checkInOutId,
    });

    if (!data) {
      return {
        status: false,
        message: "No check-in data found for the provided checkInOutId",
      };
    }

    if (isNaN(data.checkIn.checkInKiloMeters) || isNaN(checkOutKiloMeters)) {
      return {
        status: false,
        message: "Invalid values for checkIn and checkOut Kilometers!",
      };
    }

    if (data.checkIn.checkInKiloMeters > checkOutKiloMeters) {
      return {
        status: false,
        message:
          "Please enter checkOutKiloMeters greater than checkInKiloMeters!!",
      };
    }

    if (data.checkIn.checkInKiloMeters == checkOutKiloMeters) {
      return {
        status: false,
        message: "You have travelled for zero distance today!!",
      };
    }

    let distance = checkOutKiloMeters - data.checkIn.checkInKiloMeters;

    data.checkOut = {
      checkOutTime: new Date(),
      checkOutImage: checkOutImage.url,
      checkOutKiloMeters: checkOutKiloMeters,
    };
    data.distance = distance;

    await data.save();

    return {
      status: true,
      message: "Check-Out Data Saved Successfully!!",
      data: data,
    };
  } catch (error) {
    console.log(error);
    return { status: false, message: error.message, error: error };
  }
};

//request from controller to get checkIn data by riderId
const getCheckInRequest = async (riderId) => {
  try {
    const Data = await checkInsModel.findOne({ riderId: riderId });

    if (!Data) {
      return {
        status: false,
        message: "Data Not Found of Given Rider!",
      };
    }

    let checkedInData = Data.checkIn;
    return {
      status: true,
      message: "Check-In Data Retrieved Successfully!!",
      data: checkedInData,
    };
  } catch (error) {
    console.log(error);
    return { status: false, message: error.message, data: error };
  }
};

module.exports = {
  getCheckInRequest,
  addCheckInRequest,
  addCheckOutRequest,
};
