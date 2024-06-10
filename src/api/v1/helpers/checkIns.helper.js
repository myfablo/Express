const  checkInsModel  = require("../models/checkIn.model.js");
const {
  generateRandomBytes,
  getTimeInIST,
  uploadImage,
  isSameDayCheckIn,
  isSameDayCheckOut,
  getTimeDifference
} = require("./utils.helper.js");

// Add check-in request
const addCheckInRequest = async (riderId, checkInKiloMeters, inLocalFilePath) => {
  try {
    const checkInId = await generateRandomBytes(8);
    const currentTime = getTimeInIST();
    const currentDateString = currentTime.split(",")[0];
    const checkInImage = await uploadImage(inLocalFilePath);


    const data = {
      riderId,
      checkIn: {
        checkInId,
        checkInTime: new Date(),
        checkInImage: checkInImage.url,
        checkInKiloMeters,
      },
      distance: checkInKiloMeters,
      totalTime,
      isDeleted

    };

    const existingCheckInData = await checkInsModel.findOne({ riderId }).select("-__v");

    if (existingCheckInData && isSameDayCheckIn(existingCheckInData, currentDateString)) {
      return { status: false, message: "Rider already checked in for today!" };
    }

    const savedCheckInData = await checkInsModel.create(data);
    if (!savedCheckInData) {
      return { status: false, message: "Failed to save the check-in data!" };
    }

    return {
      status: true,
      message: "Check-in data saved successfully!",
      data: savedCheckInData,
    };
  } catch (error) {
    console.error(`Error while adding check-in: ${error}`);
    return { status: false, message: error.message, data: {} };
  }
};



// Add check-out request
const addCheckOutRequest = async (riderId, checkInOutId, checkOutKiloMeters, outLocalFilePath) => {
  try {
    const currentTime = getTimeInIST();
    const currentDateString = currentTime.split(",")[0];
    const checkOutImage = await uploadImage(outLocalFilePath);

    const existingData = await checkInsModel.findOne({ "checkIn.checkInId": checkInOutId }).select("-__v");

    if (!existingData) {
      return { status: false, message: "No check-in data found for the provided check-in ID." };
    }

    //check if the this checkIn id belongs to this rider or not
    if (existingData.riderId !== riderId) {
      return { status: false, message: "This check-in ID does not belong to this rider" }
    }

    if (isSameDayCheckOut(existingData, currentDateString)) {
      return { status: false, message: "You have already checked out today!" };
    }

    //checkIf checkOut KM must be greater than checkIn KM
    const checkInKiloMeters = existingData.checkIn.checkInKiloMeters;
    if (checkInKiloMeters > checkOutKiloMeters) {
      return { status: false, message: "Please enter check-out kilometers greater than check-in kilometers." };
    }
   
   // Get the time difference between checkIn and checkOut
    const checkOutTime = new Date();
    const timeDifference = await getTimeDifference(existingData.checkIn.checkInTime, checkOutTime);

    const distance = checkOutKiloMeters - existingData.checkIn.checkInKiloMeters;
    existingData.checkOut = {
      checkOutTime,
      checkOutImage: checkOutImage.url,
      checkOutKiloMeters,
    };
    existingData.distance = distance;
    existingData.totalTime = timeDifference;

    await existingData.save();

    return {
      status: true,
      message: "Check-out data saved successfully!",
      data: existingData,
    };
  } catch (error) {
    console.error(`Error while adding check-out: ${error}`);
    return { status: false, message: error.message, data: {} };
  }
};



// Get data by rider ID
const getByRiderIdRequest = async (riderId) => {
  try {
    const data = await checkInsModel.find({ riderId }).select("-__v");

    if (!data || data.length === 0) {
      return { status: false, message: "Data not found for the given rider." };
    }

    return {
      status: true,
      message: "Check-in data retrieved successfully.",
      numberOfCheckIns: data.length,
      data,
    };
  } catch (error) {
    console.error(`Error while getting data by rider ID: ${error}`);
    return { status: false, message: error.message, data: {} };
  }
};

// Get data by check-in ID
const getByCheckInIdRequest = async (checkInId) => {
  try {
    const data = await checkInsModel.findOne({ "checkIn.checkInId": checkInId }).select("-__v");

    if (!data) {
      return { status: false, message: "No data found with this check-In ID." };
    }

    return {
      status: true,
      message: "Data retrieved successfully.",
      data,
    };
  } catch (error) {
    console.error(`Error while getting data by check-in ID: ${error}`);
    return { status: false, message: error.message, data: {} };
  }
};


// Request from controller to delete data
const deleteDataRequest = async (riderId, checkInId) => {
  try {
    const data = await checkInsModel.findOne({
      riderId,
      "checkIn.checkInId": checkInId,
    });

    if (!data) {
      return {
        status: false,
        message: "Data not found!",
      };
    }

    data.isDeleted = true;
    data.save();

    return {
      status: true,
      message: "Data deleted successfully!",
    };
  } catch (error) {
    console.error("Error while deleting check-out:", error);
    return {
      status: false,
      message: error.message,
      data: {}
    };
  }
};



module.exports = {
  getByRiderIdRequest,
  getByCheckInIdRequest,
  addCheckInRequest,
  addCheckOutRequest,
  deleteDataRequest
};
