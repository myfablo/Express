const {
  badRequest,
  unknownError,
  success,
} = require("../helpers/response.helper.js");
// const isValidObjectId = require("mongoose").isValidObjectId;
const {
  getCheckInRequest,
  getCheckOutRequest,
  updateCheckInRequest,
  updateCheckOutRequest,
  deleteCheckInRequest,
  deleteCheckOutRequest,
} = require("../helpers/checkIns.helper.js");
const authenticateRider = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/multer.middleware.js");

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

    const { status, message, data } = await getCheckInRequest(
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

    const { status, message, data } = await getCheckOutRequest(
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

//function to update the checkIn
const updateCheckIn = async (req, res) => {
  try {
    const { riderId, checkInKiloMeters, checkInId } = req.body;
    if (!riderId || !checkInId) {
      return badRequest(res, "riderId and checkInId both are required!!");
    }

    if (checkInKiloMeters) {
      if (isNaN(checkInKiloMeters)) {
        return badRequest(res, "KiloMeters must be a Number!");
      }
    }

    const inLocalFilePath = req.file?.path; // Corrected accessing file path
    console.log(inLocalFilePath);
    // if (!inLocalFilePath) {
    //   return badRequest(res, "check-In image is required!!");
    // }

    const { status, message, data } = await updateCheckInRequest(
      riderId,
      checkInKiloMeters,
      inLocalFilePath,
      checkInId
    );

    // Handle response based on status
    return status
      ? success(res, message, data)
      : badRequest(res, message, data);
  } catch (error) {
    console.error("Error updating check-in document:", error);
    return unknownError(res, error);
  }
};

//function to update the checkOut
const updateCheckOut = async (req, res) => {
  try {
    const { riderId, checkOutKiloMeters, checkInId } = req.body;
    if (!riderId || !checkInId) {
      return badRequest(res, "riderId and checkInId both are required!!");
    }

    if (checkOutKiloMeters) {
      if (isNaN(checkOutKiloMeters)) {
        return badRequest(res, "KiloMeters must be a Number!");
      }
    }

    const outLocalFilePath = req.file?.path; // Corrected accessing file path
    console.log(outLocalFilePath);
    // if (!inLocalFilePath) {
    //   return badRequest(res, "check-In image is required!!");
    // }

    const { status, message, data } = await updateCheckOutRequest(
      riderId,
      checkOutKiloMeters,
      outLocalFilePath,
      checkInId
    );

    // Handle response based on status
    return status
      ? success(res, message, data)
      : badRequest(res, message, data);
  } catch (error) {
    console.error("Error updating check-out document:", error);
    return unknownError(res, error);
  }
};

//function to delete the checkIn
const deleteCheckIn = async (req, res) => {
  try {
    const { checkInId, riderId } = req.body;

    if (!riderId || !checkInId) {
      return badRequest(res, "riderId and checkInId both are required!!");
    }

    const { status, message, data } = await deleteCheckInRequest(
      riderId,
      checkInId
    );

    // Handle response based on status
    return status
      ? success(res, message, data)
      : badRequest(res, message, data);
  } catch (error) {
    console.error("Error While deleting check-In document:", error);
    return unknownError(res, error);
  }
};

//function to delete the checkOut
const deleteCheckOut = async (req, res) => {
  try {
    const { checkInId, riderId } = req.body;

    if (!riderId || !checkInId) {
      return badRequest(res, "riderId and checkInId both are required!!");
    }

    const { status, message, data } = await deleteCheckOutRequest(
      riderId,
      checkInId
    );

    // Handle response based on status
    return status
      ? success(res, message, data)
      : badRequest(res, message, data);
  } catch (error) {
    console.error("Error While deleting check-Out document:", error);
    return unknownError(res, error);
  }
};

module.exports = {
  addCheckIn,
  addCheckOut,
  updateCheckIn,
  updateCheckOut,
  deleteCheckIn,
  deleteCheckOut,
};
