const mongoose = require('mongoose');
const { Schema } = mongoose;
const basicDetailsModel = require('./basicDetails.model.js')



const vehicleDetailsSchema = new Schema({

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
    },
    isDeleted: {
        type:Boolean,
        default:false
    }
}, { timestamps: true })

const vehicleDetailsModel = mongoose.model('vehicleDetails', vehicleDetailsSchema)

module.exports =  { vehicleDetailsModel } 