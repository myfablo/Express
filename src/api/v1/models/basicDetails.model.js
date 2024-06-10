const mongoose = require('mongoose');
const { Schema } = mongoose;

const basicDetailsSchema = new Schema({
    riderId: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true
    },
    DOB: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    operationCity: {
        type: String,
        required: true,
        default:"Indore"
    },
    currentAddress: {
        type: String,
        required: true
    },
    permanentAddress: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    isLogin:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:false
    }


}, { timestamps: true })

const basicDetailsModel = mongoose.model('basicDetails', basicDetailsSchema)

module.exports = basicDetailsModel
