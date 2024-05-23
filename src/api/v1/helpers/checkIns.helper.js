const {
  badRequest,
  unknownError,
  alreadyExist,
} = require("./response.helper.js");
const { checkInsModel } = require("../models/checkIn.model.js");
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
    const checkedInData = await checkInsModel
      .findOne({ riderId: riderId })
      .select("-__v");
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
    console.error(`Something went wrong while getting data : ${error}`);
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
    const data = await checkInsModel
      .findOne({
        "checkIn.checkInId": checkInOutId,
      })
      .select("-__v");
    if (data && data.checkOut && data.checkOut.checkOutTime) {
      let retrievedTime = new Date(data.checkOut.checkOutTime);
      let formattedTime = format(retrievedTime, "MMMM-do-yyyy");
      if (time === formattedTime) {
        return {
          status: false,
          message: "You have already checked out today!!",
        };
      }
    }

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
    console.error(`Something went wrong while getting data : ${error}`);
    return { status: false, message: error.message, error: error };
  }
};

//request from controller to get data by riderId
const getByRiderIdRequest = async (riderId) => {
  try {
    const data = await checkInsModel.find({ riderId }).select("-__v");

    if (!data || data.length === 0) {
      return {
        status: false,
        message: "Data Not Found for the Given Rider!",
      };
    }

    const numberOfCheckIns = data.length;

    // Return the entire data along with the number of documents
    return {
      status: true,
      message: "Check-In Data Retrieved Successfully!",
      numberOfCheckIns: numberOfCheckIns,
      data: data,
    };
  } catch (error) {
    console.error(`Something went wrong while getting data : ${error}`);
    return { status: false, message: error.message, data: error };
  }
};

//request from controller to get data by checkInId
const getByCheckInIdRequest = async (checkInId) => {
  try {
    const data = await checkInsModel
      .findOne({ "checkIn.checkInId": checkInId })
      .select("-__v");

    if (!data) {
      return {
        status: false,
        message: "No data found with this Id!",
      };
    }

    return {
      status: true,
      message: "data retrieved successfully!",
      data: data,
    };
  } catch (error) {
    console.error(`Something went wrong while getting data : ${error}`);
    return { status: false, message: error.message, data: error };
  }
};
module.exports = {
  getByRiderIdRequest,
  getByCheckInIdRequest,
  addCheckInRequest,
  addCheckOutRequest,
};
