const mongoose = require("mongoose");

//send success response
async function success(res, message, items) {
  sendResponse(res, 200, true, message, "", items);
}

//send created response
async function created(res, message, items) {
  sendResponse(res, 201, true, message, "", items);
}

//send not found response
async function notFound(res, message) {
  sendResponse(res, 401, false, message, "", items);
}

//send badRequest response
async function badRequest(res, message, error) {
  sendResponse(res, 404, false, message, error);
}

//send unauthorised response
async function unauthorised(res, message) {
  sendResponse(res, 401, false, message, "");
}

//send forbidden response
async function forbidden(res, message) {
  sendResponse(res, 403, false, message, "");
}

//send serverValidation  errors response
async function serverValidation(res, error) {
  let responseErrors = {};
  let errors = error.errors;
  errors.forEach((error) => {
    const [key, value] = [
      error.param.toUpperCase().replace(".", "-"),
      error.msg.toUpperCase().replace(".", "-"),
    ];
    responseErrors[key] = value.toUpperCase();
  });
  sendResponse(
    res,
    400,
    false,
    "Server Validation Error",
    "ValidationError",
    responseErrors
  );
}

//send unknownError response
async function unknownError(res, error) {
  if (error instanceof mongoose.Error) {
    if (error.name == "ValidationError") {
      let errormessage = await this.validation(error.message);
      sendResponse(
        res,
        400,
        false,
        "All Fields are Required!",
        "ValidationError",
        errormessage
      );
    } else if (error.name == "CastError") {
      sendResponse(res, 400, false, "Invalid Data Or DataType", "CastError", {
        data: `Need ${error.kind} but getting ${error.valueType}`,
      });
    } else {
      sendResponse(res, 400, false, "Something Went Wrong", "Unknown", error);
    }
  } else if (error.name === "MongoError" || error.code === "11000") {
    const errormessage = await this.alreadyExist(error.message);
    sendResponse(
      res,
      400,
      false,
      "Unique Data Required!!",
      "UniqueDataRequired",
      errormessage
    );
  } else {
    sendResponse(res, 500, false, "Something Went Wrong", "unknown", error);
  }
}

//send validation error response
async function validation(e) {
  let errors = {};
  const allErrors = e.substring(e.indexOf(":") + 1).trim();
  const AllErrorArrayFormat = allErrors.split(",").map((err) => err.trim());
  AllErrorArrayFormat.forEach((error) => {
    const [key, value] = error.split(":").map((err) => err.trim());
    errors[key.toUpperCase().replace(".", "-")] = value
      .toUpperCase()
      .replace(".", "-");
  });
}

//send alreadyExist error responses
async function alreadyExist(e) {
  let errors = {};

  const keys = Object.keys(e);
  keys.forEach((error) => {
    const [key, value] = [
      error.toUpperCase().replace(".", "-"),
      error.toUpperCase().replace(".", "-") + " Already Exist",
    ];
    errors[key] = value.toUpperCase();
  });
  return errors;
}

//send onError response
async function onError(res, message, error) {
  sendResponse(res, 400, false, message, error, null);
}

//sendResponse function
async function sendResponse(res, statusCode, status, message, error, items) {
  res.json({
    status: status,
    statusCode: statusCode,
    message: message,
    error: error,
    items: items,
  });
}

//function for Invalid response
async function Invalid(res, message, items) {
  sendResponse(res, 301, false, message, "", items);
}

module.exports = {
  success,
  created,
  notFound,
  badRequest,
  unauthorised,
  forbidden,
  serverValidation,
  unknownError,
  validation,
  alreadyExist,
  onError,
  sendResponse,
  Invalid,
};
