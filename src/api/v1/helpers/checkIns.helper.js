const { checkInsModel } = require("../models/checkIn.model.js");
const { format } = require("date-fns");
const {
  generateRandomBytes,
  getTimeInIST,
  uploadImage,
} = require("./other.helper.js");

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
    return { status: false, message: error.message, data: error };
  }
};

const isSameDayCheckIn = (existingCheckInData, currentDateString) => {
  if (!existingCheckInData.checkIn || !existingCheckInData.checkIn.checkInTime) return false;
  const existingCheckInDate = new Date(existingCheckInData.checkIn.checkInTime);
  const formattedExistingCheckInDate = format(existingCheckInDate, "MMMM-do-yyyy");
  return formattedExistingCheckInDate === currentDateString;
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

    if (isSameDayCheckOut(existingData, currentDateString)) {
      return { status: false, message: "You have already checked out today!" };
    }

    const validationResult = validateCheckOut(existingData, checkOutKiloMeters);
    if (!validationResult.isValid) {
      return { status: false, message: validationResult.message };
    }

    const distance = checkOutKiloMeters - existingData.checkIn.checkInKiloMeters;
    existingData.checkOut = {
      checkOutTime: new Date(),
      checkOutImage: checkOutImage.url,
      checkOutKiloMeters,
    };
    existingData.distance = distance;

    await existingData.save();

    return {
      status: true,
      message: "Check-out data saved successfully!",
      data: existingData,
    };
  } catch (error) {
    console.error(`Error while adding check-out: ${error}`);
    return { status: false, message: error.message, error };
  }
};

const isSameDayCheckOut = (existingData, currentDateString) => {
  if (!existingData.checkOut || !existingData.checkOut.checkOutTime) return false;
  const existingCheckOutDate = new Date(existingData.checkOut.checkOutTime);
  const formattedExistingCheckOutDate = format(existingCheckOutDate, "MMMM-do-yyyy");
  return formattedExistingCheckOutDate === currentDateString;
};

const validateCheckOut = (existingData, checkOutKiloMeters) => {
  const checkInKiloMeters = existingData.checkIn.checkInKiloMeters;
  if (isNaN(checkInKiloMeters) || isNaN(checkOutKiloMeters)) {
    return { isValid: false, message: "Invalid values for check-in and check-out kilometers." };
  }
  if (checkInKiloMeters > checkOutKiloMeters) {
    return { isValid: false, message: "Please enter check-out kilometers greater than check-in kilometers." };
  }
  if (checkInKiloMeters === checkOutKiloMeters) {
    return { isValid: false, message: "You have traveled zero distance today." };
  }
  return { isValid: true };
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
    return { status: false, message: error.message, data: error };
  }
};

// Get data by check-in ID
const getByCheckInIdRequest = async (checkInId) => {
  try {
    const data = await checkInsModel.findOne({ "checkIn.checkInId": checkInId }).select("-__v");

    if (!data) {
      return { status: false, message: "No data found with this ID." };
    }

    return {
      status: true,
      message: "Data retrieved successfully.",
      data,
    };
  } catch (error) {
    console.error(`Error while getting data by check-in ID: ${error}`);
    return { status: false, message: error.message, data: error };
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
        message: "Data not found for deleting!",
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
      error,
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
