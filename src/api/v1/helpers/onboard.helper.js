const { riderFormatter } = require("../formatter/auth.formatter.js");
const { createAuthToken } = require("../middlewares/authToken.middleware.js");
const authModel = require("../models/auth.model.js");
const  basicDetailsModel  = require("../models/basicDetails.model.js");


const onboadrRiderRequest = async (fullName, email, DOB, password, Gender, operationCity, currentAddress, permanentAddress, phone) => {
    try {
        const check = await basicDetailsModel.exists({
            $or: [ { email: email }, { phone: phone }]
          });
          
        if (check) {
            return { status: false, message:"already onboarded", data: {}}
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