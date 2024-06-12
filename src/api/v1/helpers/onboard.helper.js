const { riderFormatter } = require("../formatter/auth.formatter.js");
const { createAuthToken } = require("../middlewares/authToken.middleware.js");
const authModel = require("../models/auth.model.js");
const  basicDetailsModel  = require("../models/basicDetails.model.js");


const addRider = async (userId, bodyData, authToken) => {
    try {
        const check = await basicDetailsModel.exists({ userId })
        if (check) {
            return {status: false, message:"already onboarded", data: check }
        }
        

        const formattedData = riderFormatter(bodyData, userId, authToken);
        const saveData = new partnerModel(formattedData);
        await saveData.save();
        await markUserOnboarded(userId);
        formattedData.customId = formattedData.riderId
        const token = createAuthToken("rider", formattedData)
        return {status: true, message: "rider Onboarded", data: { token, riderId: formattedData.riderId }}
    } catch (error) {
        return responseFormater(false, error.message)
    }
}

const editRider = async (userId, bodyData, token) => {
    try {
        const formattedData = riderFormatter( bodyData, token);
        await basicDetailsModel.findOneAndUpdate({ userId }, formattedData);
        return {status: true, message: "rider details updated"};
    } catch (error) {
        return {status: false, message:error.message }
    }
}

const riderByRiderId = async (riderId) => {
    try {
        const riderData = await basicDetailsModel.findOne({ riderId }).select("-_id -__v");
        return riderData ? { status: true, message: "Rider details", data: riderData } : { status: false, message: "no rider found" }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

const riderByUserId = async (userId) => {
    try {
        const riderData = await basicDetailsModel.findOne({ userId }).select("-_id -__v");
        return riderData ? { status: true, message: "Rider details", data: riderData } : { status: false, message: "no rider found" }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

const allRider = async () => {
    try {
        const riderList = await basicDetailsModel.find().select("-_id -__v");
        return riderList[0] ? { status: true, message: "Rider List", data: riderList } : { status: false, message: "no rider found" }
    } catch (error) {
        return { status: false, message: error.message }
    }
}




const markUserOnboarded = async (userId) => {
    try {
        await authModel.findOneAndUpdate({ userId: userId }, { isRiderOnboarded: true })
        return true
    } catch (error) {
        return false
    }
}
module.exports = { riderByUserId, addRider, editRider, riderByRiderId, allRider }