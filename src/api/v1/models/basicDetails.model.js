const mongoose = require('mongoose');
const { Schema } = mongoose;
const authModel = require('./auth.model.js')

const basicDetailsSchema = new Schema({
    userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'authModel',
    required: true,
    unique:true
    },
   riderId: {
        type: String,
        required: true,
        unique: true
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
    phone: {
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
    },
    isDeleted:{
        type:Boolean,
        default:false
    }


}, { timestamps: true })

const basicDetailsModel = mongoose.model('basicDetails', basicDetailsSchema)

module.exports = {basicDetailsModel}
