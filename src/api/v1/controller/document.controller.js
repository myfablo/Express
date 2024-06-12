const { documentsModel} = require('../models/documents.model.js')
const { badRequest, unknownError, success } = require("../helpers/response.helper.js");
const { validationResult } = require('express-validator')
const { uploadDocumentsRequest } = require('../helpers/document.helper.js')

const uploadDocuments = async (req, res) => {
  try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
          return res.status(400).json({
              success: false,
              msg: 'Errors',
              errors: errors.array()
          });
      }

      const { riderId } = req.body;

      const isExist = await documentsModel.exists({ riderId });
      if (isExist) {
          return badRequest(res, "documents of this rider already exist!", isExist);
      }

      // Fetch documents from req.files
      const { aadharCardFront, aadharCardBack, panCard, drivingLicenceFront, drivingLicenceBack, vehicleRCFront, vehicleRCBack, bankPassbook, insuranceDocument } = req.files;

      const documents = { aadharCardFront, aadharCardBack, panCard, drivingLicenceFront, drivingLicenceBack, vehicleRCFront, vehicleRCBack, bankPassbook, insuranceDocument};

      const { status, message, data } = await uploadDocumentsRequest(riderId, documents);

      return status ? success(res, message, data) : badRequest(res, message, data);
  } catch (error) {
      console.error(error);
      return unknownError(res, "Internal server error");
  }
}


module.exports = { uploadDocuments, }