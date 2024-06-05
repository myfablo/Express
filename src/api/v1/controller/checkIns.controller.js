const {
  badRequest,
  unknownError,
  success,
} = require("../helpers/response.helper.js");

const {
  addCheckInRequest,
  addCheckOutRequest,
  getByRiderIdRequest,
  getByCheckInIdRequest,
  deleteDataRequest
} = require("../helpers/checkIns.helper.js");

const authenticateRider = require("../middlewares/auth.middleware.js");
const { validationResult } = require('express-validator')



// Get check-ins data by riderId
const getDetailsByRiderId = async (req, res) => {
  try {

    const errors = validationResult(req);

    if (!(errors.isEmpty())) {
      return res.status(400).json({
        success: false,
        msg: 'Errors',
        errors: errors.array()
      })
    }

    const { riderId } = req.params;

    const { status, message, data } = await getByRiderIdRequest(riderId);

    return status ? success(res, message, data) : badRequest(res, message, data);

  } catch (error) {
    console.error(`Error while getting the data of rider: ${error}`);
    return unknownError(res, error);
  }
};

// Get check-ins data by checkInId
const getDetailsByCheckInId = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!(errors.isEmpty())) {
      return res.status(200).json({
        success: false,
        msg: 'Errors',
        errors: errors.array()
      })
    }

    const { checkInId } = req.params;

    const { status, message, data } = await getByCheckInIdRequest(checkInId);

    return status ? success(res, message, data) : badRequest(res, message, data);

  } catch (error) {
    console.error(`Error while getting the data of check-ins: ${error}`);
    return unknownError(res, error);
  }
};

// Add check-in controller function
const addCheckIn = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!(errors.isEmpty())) {
      return res.status(200).json({
        success: false,
        msg: 'Errors',
        errors: errors.array()
      })
    }

    const { riderId, checkInKiloMeters } = req.body;
    const inLocalFilePath = req.file?.path;

    const { status, message, data } = await addCheckInRequest(riderId, checkInKiloMeters, inLocalFilePath);

    return status ? success(res, message, data) : badRequest(res, message, data);
  } catch (error) {
    console.error("Error creating check-in document:", error);
    return unknownError(res, error);
  }
};

// Add check-out controller function
const addCheckOut = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!(errors.isEmpty())) {
      return res.status(200).json({
        success: false,
        msg: 'Errors',
        errors: errors.array()
      })
    }

    const { riderId, checkInOutId, checkOutKiloMeters } = req.body;
    const outLocalFilePath = req.file?.path;

    const { status, message, data } = await addCheckOutRequest(riderId, checkInOutId, checkOutKiloMeters, outLocalFilePath);
    return status ? success(res, message, data) : badRequest(res, message, data);
  } catch (error) {
    console.error("Error creating check-out document:", error);
    return unknownError(res, error);
  }
};

// Function to delete the check-Ins
const deleteData = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!(errors.isEmpty())) {
      return res.status(200).json({
        success: false,
        msg: 'Errors',
        errors: errors.array()
      })
    }

    const { riderId, checkInId } = req.body;

    const { status, message, data } = await deleteDataRequest(riderId, checkInId);

    return status ? success(res, message, data) : badRequest(res, message, data);
  } catch (error) {
    console.error("Error while deleting check-out document:", error);
    return unknownError(res, error);
  }
};



module.exports = {
  getDetailsByRiderId,
  getDetailsByCheckInId,
  addCheckIn,
  addCheckOut,
  deleteData
};
