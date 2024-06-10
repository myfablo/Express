const {
    generateRandomBytes,
    getTimeInIST,
    uploadImage,
    getTimeDifference
  } = require("./utils.helper.js");
  const  basicDetailsModel = require('../models/basicDetails.model.js')
  const { randomBytes } = require('node:crypto');
const { encryption } = require("../middlewares/auth.middleware.js");


  const registerRiderRequest = async(fullName, email, DOB, password, Gender, operationCity, currentAddress, permanentAddress, phoneNumber) => {
    try {
     let riderId = randomBytes(4).toString('hex');
    let hashedPassword = await encryption(password);

    const checkExistence = await basicDetailsModel.findOne({email,phoneNumber})
    if(checkExistence){
        return {status:400,message:"Rider already exists"}
    }

     let riderData = {
        riderId,
        fullName,
        email,
        DOB,
        password:hashedPassword,
        Gender,
        operationCity,
        currentAddress,
        permanentAddress,
        phoneNumber,
     }
     let rider = await basicDetailsModel.create(riderData);
     console.log(rider)

     if (!rider) {
        return { status: false, message: "Failed to save the rider data!" };
      }
  
      return {
        status: true,
        message: "rider registered successfully!",
        data: rider,
      };




        
    } catch (error) {
        console.error(`Error while adding check-in: ${error}`);
        return { status: false, message: error.message, data: {} };
    }
  }


  module.exports = { registerRiderRequest }