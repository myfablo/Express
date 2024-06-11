const basicDetailsModel = require('../models/basicDetails.model.js')
const authModel = require('../models/auth.model.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const { badRequest, unknownError, success } = require("../helpers/response.helper.js");
const { addAuth, checkAuthByPhone, generateOtpPhone, checkLogin, verifyOtp } = require('../helpers/auth.helper.js')

const loginUser = async (req, res) => {
  try {

    const errors = validationResult(req);

    if (!(errors.isEmpty())) {
      return res.status(400).json({
        success: false,
        msg: 'Errors',
        errors: errors.array()
      })
    }

    const { phone, email, password, userType = "rider" } = req.body

    req.body.userType = userType

    if (userType == 'admin') {
      const { status, message, data } = await checkLogin(email, password, userType);
      return status ? success(res, message, data) : badRequest(res, message)
    }

    if (req.body.phone) {
      const userCheck = await checkAuthByPhone(phone);
      if (userCheck) {
        let { status: loginPhoneStatus, message: loginPhoneMessage, data: loginPhoneData } = await generateOtpPhone(phone, userType);
        loginPhoneData.isPhoneLogin = true
        return loginPhoneStatus ? success(res, loginPhoneMessage, loginPhoneData) : badRequest(res, loginPhoneMessage)
      }
      const addUser = await addAuth(req.body);
      return addUser ? success(res, "otp sent successfully", addUser) : badRequest(res, "otp not send")
    }
  } catch (error) {
    console.log(error);
    return unknownError(res, "unknown error")
  }
}

const verifyUserOtp = async (req, res) => {
  try {
    const { reqId, otp } = req.body
    const otpCheck = await verifyOtp(reqId, otp);
    return otpCheck ? success(res, "otp verified", otpCheck) : badRequest(res, "otp not verified");
  } catch (error) {
    return unknownError(res, error.message)
  }
}

const resendOtp = async (req, res) => {
  try {
    const { reqId } = req.params
    const { status, message, data } = await generateOtpPhone(null, null, reqId)
    return status ? success(res, message, data) : badRequest(res, message);
  } catch (error) {
    return unknownError(res, error.message)
  }
}
module.exports = { loginUser, verifyUserOtp, resendOtp }