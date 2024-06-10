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
        type: Date,
        required: true
    },
    Gender: {
        type: String,
        required: true,
    },
    operationCity: {
        type: String,
        required: true,
        default: Indore
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
    }


}, { timestamps: true })

const basicDetailsModel = mongoose.model('basicDetails', basicDetailsSchema)

module.exports = { basicDetailsModel }
