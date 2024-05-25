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
} = require("../helpers/checkIns.helper.js");

const authenticateRider = require("../middlewares/auth.middleware.js");

// Utility function to validate presence of required fields
const validateFields = (fields, res) => {
  for (const [field, value] of Object.entries(fields)) {
    if (!value) {
      badRequest(res, `${field} is required!`);
      return false;
    }
    if (field.includes('KiloMeters') && isNaN(value)) {
      badRequest(res, `KiloMeters must be a number!`);
      return false;
    }
  }
  return true;
};

// Utility function to handle response
const handleResponse = (res, response) => {
  const { status, message, data } = response;
  if (status) {
    return success(res, message, data);
  } else {
    return badRequest(res, message, data);
  }
};

// Get check-ins data by riderId
const getDetailsByRiderId = async (req, res) => {
  try {
    const { riderId } = req.params;

    if (!riderId) {
      return badRequest(res, "Rider ID is required!");
    }

    const response = await getByRiderIdRequest(riderId);
    return handleResponse(res, response);
  } catch (error) {
    console.error(`Error while getting the data of rider: ${error}`);
    return unknownError(res, error);
  }
};

// Get check-ins data by checkInId
const getDetailsByCheckInId = async (req, res) => {
  try {
    const { checkInId } = req.params;

    if (!checkInId) {
      return badRequest(res, "Check-in ID is required!");
    }

    const response = await getByCheckInIdRequest(checkInId);
    return handleResponse(res, response);
  } catch (error) {
    console.error(`Error while getting the data of check-ins: ${error}`);
    return unknownError(res, error);
  }
};

// Add check-in controller function
const addCheckIn = async (req, res) => {
  try {
    const { riderId, checkInKiloMeters } = req.body;
    const inLocalFilePath = req.file?.path;

    const fields = { riderId, checkInKiloMeters, 'Check-in image': inLocalFilePath };

    if (!validateFields(fields, res)) return;

    const response = await addCheckInRequest(riderId, checkInKiloMeters, inLocalFilePath);
    return handleResponse(res, response);
  } catch (error) {
    console.error("Error creating check-in document:", error);
    return unknownError(res, error);
  }
};

// Add check-out controller function
const addCheckOut = async (req, res) => {
  try {
    const { riderId, checkInOutId, checkOutKiloMeters } = req.body;
    const outLocalFilePath = req.file?.path;

    const fields = { riderId, checkInOutId, checkOutKiloMeters, 'Check-out image': outLocalFilePath };

    if (!validateFields(fields, res)) return;

    const response = await addCheckOutRequest(riderId, checkInOutId, checkOutKiloMeters, outLocalFilePath);
    return handleResponse(res, response);
  } catch (error) {
    console.error("Error creating check-out document:", error);
    return unknownError(res, error);
  }
};

module.exports = {
  getDetailsByRiderId,
  getDetailsByCheckInId,
  addCheckIn,
  addCheckOut,
};
