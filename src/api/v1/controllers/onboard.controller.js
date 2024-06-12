const basicDetailsModel = require('../models/basicDetails.model.js')
const { validationResult } = require('express-validator')
const { badRequest, unknownError, success} = require("../helpers/response.helper.js");
const { addRider, checkAuthByPhone} = require('../helpers/auth.helper.js');
const { riderByUserId } = require('../helpers/onboard.helper.js');

const onboardRider = async (req,res) => {
    try {

      const errors = validationResult(req);

    if (!(errors.isEmpty())) {
      return res.status(400).json({
        success: false,
        msg: 'Errors',
        errors: errors.array()
      })
    }

        const token = parseJwt(req.headers.authorization)
        console.log(token);
        const { status, message, data } = await addRider(token.userId, req.body, token);
        return status ? success(res, message, data) : badRequest(res, message);
  
    } catch (error) {
        console.error(`Error while getting the data of rider: ${error}`);
    return unknownError(res, error.message);
    }
}

const changeRiderDetail = async (req, res) => {
  try {
      const token = parseJwt(req.headers.authorization)
      const { status, message } = await editRider(token.userId, req.body, token);
      return status ? success(res, message) : badRequest(res, message);
  } catch (error) {
      return unknownError(res, error.message);
  }
}


const getRiderDetailsByUserId = async (req, res) => {
  try {
      const token = parseJwt(req.headers.authorization)
      const { status, message, data } = await riderByUserId(token.userId);
      return status ? success(res, message, data) : badRequest(res, message);
  } catch (error) {
      return unknownError(res, error.message);
  }
}
const getRiderDetailsByRiderId = async (req, res) => {
  try {
      const token = parseJwt(req.headers.authorization)
      if (token.role != 1) {
          token.customId = req.query.partnerId
      }
      const { status, message, data } = await riderByRiderId(token.customId);
      return status ? success(res, message, data) : badRequest(res, message);
  } catch (error) {
      return unknownError(res, error.message);
  }
}
const getAllRider = async (req, res) => {
  try {
      const { status, message, data } = await allRider();
      return status ? success(res, message, data) : badRequest(res, message);
  } catch (error) {
      return unknownError(res, error.message);
  }
}
module.exports = { onboardRider, changeRiderDetail, getRiderDetailsByUserId, getRiderDetailsByRiderId, getAllRider }