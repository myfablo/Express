const { randomBytes } = require('node:crypto');
const { encryption } = require("../middlewares/authToken.middleware.js");


const authFormatter = async (data) => {
    const d = new Date
    let encryptedPassword
    const userId = randomBytes(4).toString('hex')
    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
    const reqId = randomBytes(4).toString('hex')
    let isPhoneOtp = true
    if (data.password) {
        encryptedPassword = await encryption(data.password)
        isPhoneOtp = false;
    }
    return {
        userId: userId,
        email: data.email,
        userType: data.userType,
        password: encryptedPassword,
        phone: data.phone,
        otp: otp,
        reqId: reqId,
        userType: data.userType,
        date: d.getDate(),
        isPhoneOtp: isPhoneOtp,
    }
}
const customerFormatter = (userId, userData) => {
    const customerId = randomBytes(4).toString('hex')
    return {
        userId: userId,
        customerId: customerId,
        phone: userData.phone,
        name: userData.name,
        email: userData.email
    }
}
const customerEditFormatter = (userData) => {
    return {
        name: userData.name,
        email: userData.email,
        image: userData.image,
        isCODEnable: userData.isCODEnable
    }
}

const riderFormatter = (data, userId = false, roamId, partnerId) => {
    return userId ? {
        userId: userId,
        partnerId: partnerId,
        name: data.name,
        phone: data.phone,
        roamId,
        image: data.image,
        dob: data.dob,
        vehicleNo: data.vehicleNo,
        gender: data.gender,
        aadhaar: data.aadhaar,
        pan: data.pan,
        insurance: data.insurance,
        drivingLicense: data.drivingLicense,
        rcCard: data.rcCard,
        zone: data.zone,
    } : {
        name: data.name,
        image: data.image,
        dob: data.dob,
        vehicleNo: data.vehicleNo,
        gender: data.gender,
        insurance: data.insurance,
        rcCard: data.rcCard,
        zone: data.zone,
    }
}


function clock() {
    let date = new Date
    let hour = date.getHours()
    let timeZone = "AM"
    let minute = date.getMinutes()
    if (hour >= 12) {
        hour -= 12
        timeZone = "PM"
    }
    if (hour == 0) {
        hour = 12
    }
    return `${hour}:${minute} ${timeZone}`
}

module.exports = { riderFormatter, customerEditFormatter, customerFormatter, authFormatter }