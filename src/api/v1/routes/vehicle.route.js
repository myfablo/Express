const express = require("express");
const router = express.Router();
const { uploadVehicle, getVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicle.controller.js')
const { validateVehicleDetails, validateGetUpdateDelete } = require('../validators/vehicle.validator.js')
const {upload} = require("../middlewares/multer.middleware.js");
const { authenticateRider } = require("../middlewares/authToken.middleware.js");
const { vehicleDetailsModel } = require("../models/vehicleDetails.model.js");


router.post('/upload-vehicle', validateVehicleDetails, upload.single('vehicleImage'), uploadVehicle)
router.get('get-vehicle', validateGetUpdateDelete, getVehicle);
router.post('update-vehicle', validateGetUpdateDelete, upload.single('vehicleImage'), updateVehicle)
router.delete('delete-vehicle', validateGetUpdateDelete, deleteVehicle)


module.exports = router
