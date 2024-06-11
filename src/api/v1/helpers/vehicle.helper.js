const { vehicleDetailsModel } = require('../models/vehicleDetails.model.js')
const { uploadImage } = require('./utils.helper.js')


const uploadBicycleDetails = async ( riderId, vehicleType, drivingLicenceNumber) => {
    try {
        const vehicleData = new vehicleDetailsModel(
            {
                riderId,
                vehicleType,
                drivingLicenceNumber
            }
        )
        const bicycleData = await vehicleData.save();

        return { status: true, message: 'vehicle data saved successfully!', data: bicycleData }

    } catch (error) {
        console.log(`Error while uploading vehicle details: ${error}`)
        return { status: false, message: "Error while uploading vehicle details!", data: {} }

    }
}

const vehicleDetailsRequest = async ( riderId, vehicleType, registrationNumber, drivingLicenceNumber, insuranceNumber, insuranceCompany, vehicleImage) => {
    try {
        const vehicleImageUrl = await uploadImage(vehicleImage);

        const vehicleData = new vehicleDetailsModel({
            riderId,
            vehicleType,
            registrationNumber,
            drivingLicenceNumber,
            insuranceNumber,
            insuranceCompany,
            vehicleImageUrl
        })
        const savedData = await vehicleData.save();
        return {
            status: true,
            message: "vehicle data saved successfully!",
            data: savedData
        }


    } catch (error) {
        console.log(`Error while uploading vehicle details: ${error}`)
        return { status: false, message: "Error while uploading vehicle details!", data: {} } 
    }
}


const getVehicleRequest = async( riderId ) => {
    try {

     const isExist = await vehicleDetailsModel.exists({riderId})
     if(!isExist){
        return { status: false, message: "vehicle details of this rider does not exist!", data: {}}
     }
   
     return {
        status: true,
        message: "vehicle details fetched successfully!",
        data: isExist
     }

        
    } catch (error) {
        console.log(`Error while getting vehicle details: ${error}`)
        return { status: false, message: "Error while getting vehicle details!", data: {} }
    }
}

const updateVehicleRequest = async( riderId, vehicleType, registrationNumber, drivingLicenceNumber, insuranceNumber, insuranceCompany, vehicleImage) => {
try {
    
        const vehicleImageUrl = await uploadImage(vehicleImage);
    
        const updatedData = await vehicleDetailsModel.findOneAndUpdate({ riderId}, {
            vehicleImageUrl,
            vehicleType,
            registrationNumber,
            drivingLicenceNumber,
            insuranceNumber,
            insuranceCompany
        },
    { new: true }
    )
    
    return {
        status: true,
        message: "details of vehicles to be updated!",
        data: updatedData
    }
} catch (error) {
    console.log(`Error while updating vehicle details: ${error}`)
        return { status: false, message: "Error while updating vehicle details!", data: {} } 
}
}

module.exports = { uploadBicycleDetails, vehicleDetailsRequest, getVehicleRequest, updateVehicleRequest }