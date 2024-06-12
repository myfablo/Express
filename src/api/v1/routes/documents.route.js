const express = require("express");
const router = express.Router();
const { validateDocumentsUpload, validateGetUpdateDelete } = require('../validators/documents.validator.js');
const { upload } = require('../middlewares/multer.middleware.js');
const { authenticateRider } = require("../middlewares/authToken.middleware.js");
const { uploadDocuments, getDocuments, updateDocuments, deleteDocuments } = require('../controllers/documents.controller.js');

// Route to upload documents
router.post('/upload-documents', upload.fields([
    { name: 'aadharCardFront', maxCount: 1 },
    { name: 'aadharCardBack', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'drivingLicenceFront', maxCount: 1 },
    { name: 'drivingLicenceBack', maxCount: 1 },
    { name: 'vehicleRCFront', maxCount: 1 },
    { name: 'vehicleRCBack', maxCount: 1 },
    { name: 'bankPassbook', maxCount: 1 },
    { name: 'insuranceDocument', maxCount: 1 }
]), validateDocumentsUpload, uploadDocuments);

// Route to get documents
router.get('/get-documents',validateGetUpdateDelete, getDocuments);

// Route to update documents
router.post('/update-documents', upload.fields([
    { name: 'aadharCardFront', maxCount: 1 },
    { name: 'aadharCardBack', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'drivingLicenceFront', maxCount: 1 },
    { name: 'drivingLicenceBack', maxCount: 1 },
    { name: 'vehicleRCFront', maxCount: 1 },
    { name: 'vehicleRCBack', maxCount: 1 },
    { name: 'bankPassbook', maxCount: 1 },
    { name: 'insuranceDocument', maxCount: 1 }
]), validateGetUpdateDelete, updateDocuments);

// Route to delete documents
router.delete('/delete-documents', validateGetUpdateDelete, deleteDocuments);

module.exports = router;
