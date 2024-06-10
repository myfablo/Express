const mongoose = require('mongoose');
const { Schema } = mongoose;
const basicDetailsModel = require('./basicDetails.model.js')



const vehicleInfoSchema = new Schema({

    riderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'basicDetailsModel',
        required: true,
      },
    vehicleType: {
        type: String,
        required: true,
        enum: ['car', 'bike', 'scooter', 'bicycle']
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true,

    },
    drivingLicenceNumber: {
        type: String,
        required: true,
        unique: true
    },
    vehicleImage: {
        type: String,
        required: true
    },
    insuranceNumber: {
        type: String,
        required: true,
        unique: true
    },
    insuranceCompany: {
        type: String,
        required: true
    }
}, { timestamps: true })

const vehicleInfoModel = mongoose.model('vehicleInfo', vehicleInfoSchema)

module.exports =  vehicleInfoModel 