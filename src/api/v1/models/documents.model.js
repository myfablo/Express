const mongoose = require('mongoose');
const { Schema } = mongoose;
const basicDetailsModel = require('./basicDetails.model.js')


const documentsSchema = new Schema({
    riderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'basicDetailsModel',
        required: true,
      },
    aadharCardFront: {
        type: String,
        required: true
    },
    aadharCardBack: {
        type: String,
        required: true
    },
    panCard: {
        type: String,
        required: true
    },
    drivingLicenceFront: {
        type: String,
        required: true
    },
    drivingLicenceBack: {
        type: String,
        required: true
    },
    vehicleRCFront: {
        type: String,
        required: true
    },
    vehicleRCBack: {
        type: String,
        required: true
    },
    bankPassbook: {
        type: String,
        required: true
    },
    insuranceDocument: {
        type: String,
        required: true
    }
}, { timestamps: true })
const documentsModel = mongoose.model('documents', documentsSchema)

module.exports = {documentsModel}
