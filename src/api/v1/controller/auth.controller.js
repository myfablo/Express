const basicDetailsModel = require('../models/basicDetails.model.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const { badRequest, unknownError, success} = require("../helpers/response.helper.js");
const { registerRiderRequest} = require('../helpers/auth.helper.js')

const registerRider = async (req,res) => {
    try {

        const errors = validationResult(req);

        if (!(errors.isEmpty())) {
          return res.status(400).json({
            success: false,
            msg: 'Errors',
            errors: errors.array()
          })
        }
    
    const { fullName, email, DOB, password, Gender, operationCity, currentAddress, permanentAddress, phoneNumber } = req.body;

    const { status, message, data } = await registerRiderRequest(fullName, email, password, DOB, Gender, operationCity, currentAddress, permanentAddress, phoneNumber);

    return status ? success(res, message, data) : badRequest(res, message, data);

        
    } catch (error) {
        console.error(`Error while getting the data of rider: ${error}`);
    return unknownError(res, error);
    }
}

const loginRider = async (req,res) => {
try {

    const errors = validationResult(req);

    if (!(errors.isEmpty())) {
      return res.status(400).json({
        success: false,
        msg: 'Errors',
        errors: errors.array()
      })
    }

    const { email , phoneNumber, password} = req.body
} catch (error) {
    console.error(`Error while getting the data of rider: ${error}`);
    return unknownError(res, error);
}
}
module.exports = { registerRider, loginRider, }