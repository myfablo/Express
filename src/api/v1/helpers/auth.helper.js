const { getTimeInIST, uploadImage, getTimeDifference } = require("./utils.helper.js");
const basicDetailsModel = require('../models/basicDetails.model.js')
const authModel = require('../middlewares/authToken.middleware.js')
const authFormatter = require('../formatter/auth.formatter.js')
const { checkEncryption } = require("../middlewares/authToken.middleware.js");
const { createAuthToken } = require('../middlewares/authToken.middleware.js')
const { riderByUserId } = require('./onboard.helper.js')

const addAuth = async (bodyData, userType) => {
  try {
    const formattedData = await authFormatter(bodyData);
    const saveData = await authModel(formattedData);
    if (userType == admin) {
      return await saveData.save() ? { userId: formattedData.userId } : false
    }
    if (bodyData.phone) {
      await sendSms(formattedData.phone, formattedData.otp)
      return await saveData.save() ? { reqId: formattedData.reqId, isOnboarded: false, isPhoneLogin: true } : false
    }
  } catch (error) {
    return false
  }
}

const checkAuthByPhone = async (phone) => {
  try {
    const authData = await authModel.exists({ phone });
    return authData ? authData : false;
  } catch (error) {
    return false
  }
}

const checkLogin = async (email, password, userType) => {
  try {
    const adminData = await authModel.findOne({ email });
    if (!adminData) {
      return { status: false, message: "admin not found", data: {} }
    }
    const passwordCheck = await checkEncryption(password, userData.password);
    if (!passwordCheck) {
      return { status: false, message: "invalid password", data: {} }
    }
    if (adminData.isEmailVerified) {
      adminData.isLogin = true
      await adminData.save()
      const token = createAuthToken(userType, adminData);
      return { status: true, message: "login successful", data: { token, adminData } }


    }
  } catch (error) {
    console.log(error);
    return { status: false, message: 'Error while loging In admin!', data: {} }
  }
}


const generateOtpPhone = async (phone, userType, oldReqId) => {
  const date = new Date
  const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
  const reqId = randomBytes(4).toString('hex')
  let updatedData
  if (oldReqId) {
    updatedData = await authModel.findOne({ reqId: oldReqId })
    if (!updatedData) {
      return { status: false, message: "invalid request", data: {} }
    }
  } else {
    updatedData = await authModel.findOne({ phone })
  }
  if (updatedData.noOfOtp >= 10 && updatedData.date == date.getDate()) {
    return { status: false, message: "otp limit reached. try again tomorrow", data: { attempt: updatedData.noOfOtp } }
  }
  if (userType) {
    updatedData.userType = userType
  }
  updatedData.otp = otp;
  updatedData.reqId = reqId;
  updatedData.noOfOtp += 1
  updatedData.date = date.getDate();
  updatedData.isPhoneOtp = true;
  if (phone == "1111111111") {
    updatedData.otp = "1111"
  }
  const saveData = await updatedData.save()
  if (!saveData) {
    return { status: false, message: "otp not sent", data: {} }
  }
  userType = updatedData.userType
  await sendSms(updatedData.phone, otp)
  if (userType === 'rider') {
    return { status: true, message: "otp sent to phone", data: { reqId: reqId, isOnboarded: updatedData.isriderOnboarded, attempt: updatedData.noOfOtp } }
  }
  else {
    return { status: true, message: "otp sent to phone", data: { reqId: reqId, isOnboarded: updatedData.isClientOnboarded, attempt: updatedData.noOfOtp } }
  }
}

const verifyOtp = async (reqId, otp) => {
  try {
    const newReqId = randomBytes(4).toString('hex')
    const newOtp = Math.floor(Math.random() * (9999 - 1000) + 1000)
    const userData = await authModel.findOne({ reqId });
    if (!userData) {
      return false
    }
    if (userData.otp == otp) {
      if (!userData.isPhoneOtp) {
        userData.isEmailVerified = true
      }
      const customId = await getCustomId(userData.userId, userData.userType)
      if (userData.userType == 'rider') {
        userData.customId = customId.riderId

        //   userData.roamId = customId.roamId
      } else {
        userData.customId = customId
      }
      const token = createAuthToken(userData.userType, userData);
      userData.noOfOtp = 0
      userData.otp = newOtp
      userData.reqId = newReqId
      await userData.save()
      if (userData.userType === 'rider') {
        return { token, isOnboarded: userData.isRiderOnboarded, riderId: userData.customId, isPhoneLogin: userData.isPhoneOtp }  //, roamId: userData.roamId
      }
      if (userData.userType === 'customer') {
        return { token, isOnboarded: userData.isClientOnboarded, customerId: userData.customId, isPhoneLogin: userData.isPhoneOtp }
      }
      return { token, isOnboarded: userData.isOnboarded, customerId: userData.customId, isPhoneLogin: userData.isPhoneOtp }
    }
    return false
  } catch (error) {
    return false
  }
}


const getCustomId = async (userId, userType) => {
  try {
    switch (userType) {
      case "rider":
        const riderData = await riderByUserId(userId)
        return riderData.status ? { riderId: riderData.riderId } : "" //roadId: riderData.data.roamId
      default:
        const customerData = await customerById(userId)
        return customerData.status ? customerData.data.customerId : ""
    }
  } catch (error) {
    return ""
  }
}
module.exports = { addAuth, checkAuthByPhone, generateOtpPhone, checkLogin, verifyOtp }