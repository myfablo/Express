const { badRequest, unknownError } = require("./response.helper.js");
const moment = require("moment-timezone");
const {checkInsModel} = require("../models/checkIn.model.js");
const mongoose = require("mongoose");
const {
  generateRandomBytes,
  getTimeInIST,
  uploadImage,
} = require("./other.helper.js"
)

 

//request from controller to checkIN
const getCheckInRequest = async (riderId, checkInKiloMeters, inLocalFilePath) => {
  try {
    // Take id and time from the separate created function
    const checkInId = await generateRandomBytes(8);
    const checkInTime = getTimeInIST();

    // // Get the start and end of the day in Indian Standard Time (IST)
    // const startOfDayIST = moment(checkInTime).startOf("day");
    // const endOfDayIST = moment(checkInTime).endOf("day");

    // // Check if the rider has already checked in on the current day
    // const existingCheckIn = await checkInsModel.findOne({
    //   riderId
      
    // });
    // console.log(existingCheckIn)

    // if (existingCheckIn) {
    //   return { status: false, message: "Rider has already checked in today.", existingCheckIn };
    // }

    // Take image from the separate created function
    const checkInImage = await uploadImage(inLocalFilePath);

    // Construct data object for check-in
    const data = {
      riderId: riderId,
      checkIn: {
        checkInId: checkInId,
        checkInTime: checkInTime.format("MMMM Do YYYY, h:mm:ss a"),
        checkInImage: checkInImage.url,
        checkInKiloMeters: checkInKiloMeters,
      },
      distance: checkInKiloMeters, // Assuming you want to set distance to checkInKiloMeters
    };

    // Save the check-in data
    const checkInData = await checkInsModel.create(data);

    if (!checkInData) {
      return { status: false, message: "Failed to save the Check-In Data!!", data: error };
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


//fxn to help the checkout controller
const getCheckOutRequest = async (riderId, checkInOutId, checkOutKiloMeters, outLocalFilePath) => {
  try {
    const checkOutTime = getTimeInIST();
    console.log(checkOutTime)



    const checkOutImage = await uploadImage(outLocalFilePath);
   // console.log(riderId, checkInOutId, checkOutKiloMeters, outLocalFilePath)

   const data = await checkInsModel.findOne({ 'checkIn.checkInId': checkInOutId });
   // const data = await checkInsModel.findById(checkInOutId);

    //const checkInData = data.checkIn || {};

    if (!data) {
      return { status: false, message: "No check-in data found for the provided checkInOutId" };
    }

    if (data.checkIn.checkInId.toString() !== checkInOutId) {
      return { status: false, message: "Invalid riderId or checkInOutId provided" };
    }

    if(data.checkIn.checkInKiloMeters > checkOutKiloMeters){
      return {status :false , message: "Please enter checkOutKiloMeters greater than checkInKiloMeters!!"}
    }
    if(data.checkIn.checkInKiloMeters == checkOutKiloMeters){
      return {status :false , message: "You have travelled for zero distance today!!"}
    }
     //console.log(checkInData.kiloMeters);
     const startDst = data.checkIn?.kiloMeters || 0;
     
    console.log(startDst)
    const endDst = checkOutKiloMeters;

    if (isNaN(data.checkIn.checkInKiloMeters) || isNaN(checkOutKiloMeters)) {
      return { status: false, message: "Invalid values for checkIn and checkOut Kilometers!" };
    }

    if (endDst < startDst) {
      return { status: false, message: "checkOutKiloMeters must be greater than checkInKiloMeters!", endDst };
    } else if (endDst === startDst) {
      return { status: false, message: "You traveled Zero(0) kilometers today!" };
    }

    let distance = (checkOutKiloMeters) - (data.checkIn.checkInKiloMeters);

    data.checkOut = {
      checkOutTime: checkOutTime.format("MMMM Do YYYY, h:mm:ss a"),
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
    return { status: false, message: error.message, error:error };
  }
};
module.exports = { getCheckInRequest, getCheckOutRequest };
