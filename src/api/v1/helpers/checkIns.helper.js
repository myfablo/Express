const {
  badRequest,
  unknownError,
  alreadyExist,
} = require("./response.helper.js");
const moment = require("moment-timezone");
const { checkInsModel } = require("../models/checkIn.model.js");
const mongoose = require("mongoose");
const {
  generateRandomBytes,
  getTimeInIST,
  uploadImage,
} = require("./other.helper.js");

//request from controller to checkIn
const getCheckInRequest = async (
  riderId,
  checkInKiloMeters,
  inLocalFilePath
) => {
  try {
    // Take id and time from the separate created function
    const checkInId = await generateRandomBytes(8);
    const Time = getTimeInIST();
    // console.log(Time);
    // console.log(Time.split(",")[0]);
    // console.log(Time.split(",")[0]);
    let compareTime = Time.split(",")[0];
    console.log(compareTime);

    // Take image from the separate created function
    const checkInImage = await uploadImage(inLocalFilePath);

    // Construct data object for check-in
    const data = {
      riderId: riderId,
      checkIn: {
        checkInId: checkInId,
        checkInTime: Time,
        checkInImage: checkInImage.url,
        checkInKiloMeters: checkInKiloMeters,
      },
      distance: checkInKiloMeters, // Assuming you want to set distance to checkInKiloMeters
    };
    let checkInData;
    //checking if there is already a checkin by the same user
    const checkedInData = await checkInsModel.findOne({ riderId: riderId });
    if (
      checkedInData &&
      checkedInData.checkIn &&
      checkedInData.checkIn.checkInTime
    ) {
      let retrievedTime = checkedInData.checkIn.checkInTime;
      //  console.log(retrievedTime);
      let formattedTime = retrievedTime.split(",")[0];
      console.log(formattedTime);

      if (formattedTime === compareTime) {
        return {
          status: false,
          message: "Rider already checkedIn for today!",
          // data: error,
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
        //data: error,
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
const getCheckOutRequest = async (
  riderId,
  checkInOutId,
  checkOutKiloMeters,
  outLocalFilePath
) => {
  try {
    const checkingOutTime = getTimeInIST();
    //console.log(checkOutTime);
    const Time = checkingOutTime.split(",")[0];
    console.log(Time);

    const checkOutImage = await uploadImage(outLocalFilePath);
    // console.log(riderId, checkInOutId, checkOutKiloMeters, outLocalFilePath)

    //checking if the rider has already checkedOut or not
    const checkOutData = await checkInsModel.findOne({ riderId: riderId });
    if (
      checkOutData &&
      checkOutData.checkOut &&
      checkOutData.checkOut.checkOutTime
    ) {
      let retrievedTime = checkOutData.checkOut.checkOutTime;
      // console.log(retrievedTime);
      let retrievedTimeSplit = retrievedTime.split(",")[0];
      // console.log(retrievedTimeSplit);
      if (Time === retrievedTimeSplit) {
        return {
          status: false,
          message: "You have already checked out!!",
        };
      }
    }

    const data = await checkInsModel.findOne({
      "checkIn.checkInId": checkInOutId,
    });
    // const data = await checkInsModel.findById(checkInOutId);

    //const checkInData = data.checkIn || {};

    if (!data) {
      return {
        status: false,
        message: "No check-in data found for the provided checkInOutId",
      };
    }

    if (data.checkIn.checkInId.toString() !== checkInOutId) {
      return {
        status: false,
        message: "Invalid riderId or checkInOutId provided",
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
    //console.log(checkInData.kiloMeters);
    const startDst = data.checkIn?.kiloMeters || 0;

    console.log(startDst);
    const endDst = checkOutKiloMeters;

    if (isNaN(data.checkIn.checkInKiloMeters) || isNaN(checkOutKiloMeters)) {
      return {
        status: false,
        message: "Invalid values for checkIn and checkOut Kilometers!",
      };
    }

    if (endDst < startDst) {
      return {
        status: false,
        message: "checkOutKiloMeters must be greater than checkInKiloMeters!",
        endDst,
      };
    } else if (endDst === startDst) {
      return {
        status: false,
        message: "You traveled Zero(0) kilometers today!",
      };
    }

    let distance = checkOutKiloMeters - data.checkIn.checkInKiloMeters;

    data.checkOut = {
      checkOutTime: checkingOutTime, //.format("MMMM Do YYYY, h:mm:ss a"),
      checkOutImage: checkOutImage.url,
      checkOutKilometers: checkOutKiloMeters,
    };
    data.distance = distance;

    await data.save();
    // console.log(data)
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
module.exports = { getCheckInRequest, getCheckOutRequest };
