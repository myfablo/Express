const {
  badRequest,
  unknownError,
  success,
} = require("../helpers/response.helper.js");
// const isValidObjectId = require("mongoose").isValidObjectId;
const {
  addCheckInRequest,
  addCheckOutRequest,
  getCheckInRequest,
} = require("../helpers/checkIns.helper.js");
const authenticateRider = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/multer.middleware.js");

//get the checkIn Data by riderId
const getCheckInByRiderId = async (req, res) => {
  try {
    const riderId = req.params.riderId;

    if (!riderId) {
      return badRequest(res, "Rider Id is required!");
    }

    const { status, message, data } = getCheckInRequest(riderId);

    return status
      ? success(res, message, data)
      : badRequest(res, message, data);
  } catch (error) {
    console.log(`Error while getting the data of rider: ${error}`);
    return unknownError(res, error);
  }
};

//check-In controller function
const addCheckIn = async (req, res) => {
  try {
    //let checkInId,riderId;
    const { riderId, checkInKiloMeters } = req.body;

    //taking file from request
    const inLocalFilePath = req.file?.path;
    console.log(inLocalFilePath);
    if (!inLocalFilePath) {
      return badRequest(res, "check-In image is required!!");
    }

    // console.log(riderId, checkInId,kiloMeters)

    if (!riderId) {
      return badRequest(res, "riderId is required!");
    }
    if (!checkInKiloMeters) {
      return badRequest(res, "Check-In kiloMeters value is required!");
    }
    if (isNaN(checkInKiloMeters)) {
      return badRequest(res, "KiloMeters must be a Number!");
    }

    const { status, message, data } = await addCheckInRequest(
      riderId,
      checkInKiloMeters,
      inLocalFilePath
    );
    return status
      ? success(res, message, data)
      : badRequest(res, message, data);
  } catch (error) {
    console.error("Error creating check-in document:", error);
    return unknownError(res, error);
  }
};
//check Out controller  function
const addCheckOut = async (req, res) => {
  try {
    const { riderId, checkInOutId, checkOutKiloMeters } = req.body;

    if (!riderId) {
      return badRequest(res, "riderId is required!!");
    }
    if (!checkInOutId) {
      return badRequest(res, "checkInOutId is required!!");
    }
    if (!checkOutKiloMeters) {
      return badRequest(res, "checkOut KiloMeters is required!");
    }
    if (isNaN(checkOutKiloMeters)) {
      return badRequest(res, "KiloMeters must be a Number!");
    }

    //taking file from request
    const outLocalFilePath = req.file?.path;
    console.log(outLocalFilePath);
    if (!outLocalFilePath) {
      return badRequest(res, "check-Out image is required!!");
    }

    const { status, message, data } = await addCheckOutRequest(
      riderId,
      checkInOutId,
      checkOutKiloMeters,
      outLocalFilePath
    );
    return status
      ? success(res, message, data)
      : badRequest(res, message, data);
  } catch (error) {
    console.error("Error creating check-out document:", error);
    return unknownError(res, error);
  }
};

module.exports = {
  getCheckInByRiderId,
  addCheckIn,
  addCheckOut,
};
