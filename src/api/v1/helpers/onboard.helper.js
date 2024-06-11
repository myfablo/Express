const { riderFormatter } = require("../formatter/auth.formatter.js");
const { createAuthToken } = require("../middlewares/authToken.middleware.js");
const authModel = require("../models/auth.model.js");
const  basicDetailsModel  = require("../models/basicDetails.model.js");


const onboadrRiderRequest = async (fullName, email, DOB, password, Gender, operationCity, currentAddress, permanentAddress, phone) => {
    try {
        const check = await basicDetailsModel.exists({ userId })
        if (check) {
            return responseFormater(false, "already onboarded")
        }
        
    } catch (error) {
        
    }
}

const riderByUserId = async (userId) => {
    try {
        const riderData = await basicDetailsModel.findOne({ userId }).select("-_id -__v");
        return riderData ? responseFormater(true, "Partner details", riderData) : responseFormater(false, "no partner found",)
    } catch (error) {
        return responseFormater(false, error.message)
    }
}

module.exports = { riderByUserId, onboadrRiderRequest, }