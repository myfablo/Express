const { badRequest, unknownError, success } = require("../helpers/response.helper.js");
const { validationResult } = require('express-validator')
const { uploadBicycle, uploadVehicleRequest, getVehicleRequest, updateVehicleRequest } = require('../helpers/vehicle.helper.js')





const uploadVehicle = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!(errors.isEmpty())) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            })
        }

        const check = await vehicleDetailsModel.exists({ riderId });
        if (check) {
            badRequest(res, "vehicle details of this rider already exists!")
        }

        if (req.body.vehicleType === 'bicycle') {
            const { riderId, vehicleType, drivingLicenceNumber } = req.body
            const { status, message, data } = await uploadBicycle(riderId, vehicleType, drivingLicenceNumber)
            return status ? success(res, message, data) : badRequest(res, message);

        }

        const { riderId, vehicleType, registrationNumber, drivingLicenceNumber, insuranceNumber, insuranceCompany } = req.body;
        const vehicleImage = req.file?.path;
        const { status, message, data } = await uploadVehicleRequest(riderId, vehicleType, registrationNumber, drivingLicenceNumber, insuranceNumber, insuranceCompany, vehicleImage)
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        console.error(`Error while uploading vehicle details: ${error}`);
        return unknownError(res, error);
    }
}

const getVehicle = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!(errors.isEmpty())) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            })
        }

        const { riderId } = req.params;

        const { status, message, data } = await getVehicleRequest(riderId);
        return status ? success(res, message, data) : badRequest(res, message)

    } catch (error) {
        console.error(`Error while getting vehicle details: ${error}`);
        return unknownError(res, error);
    }

}

const updateVehicle = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!(errors.isEmpty())) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            })
        }

        const check = await vehicleDetailsModel.exists({ riderId });
        if (!check) {
            badRequest(res, "vehicle details of this rider does not exists!")
        }


        const { riderId, vehicleType, registrationNumber, drivingLicenceNumber, insuranceNumber, insuranceCompany } = req.body;
        const vehicleImage = req.file?.path;
        const { status, message, data } = await updateVehicleRequest(riderId, vehicleType, registrationNumber, drivingLicenceNumber, insuranceNumber, insuranceCompany, vehicleImage)
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        console.error(`Error while updating vehicle details: ${error}`);
        return unknownError(res, error);
    }
}

const deleteVehicle = async (req, res) => {

    try {
        const check = await vehicleDetailsModel.exists({ riderId });
        if (!check) {
            badRequest(res, "vehicle details of this rider does not exists!")
        }

     check.isDelete = true;
     const deletedData = await check.save();
     return success( res, "data deleted successfully", deletedData)

    } catch (error) {
        console.error(`Error while deleting vehicle details: ${error}`);
        return unknownError(res, error);
    }
}

module.exports = { uploadVehicle, getVehicle, updateVehicle, deleteVehicle }