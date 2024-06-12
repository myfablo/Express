const { uploadImage } = require('./utils.helper.js');
const { documentsModel } = require('../models/documents.model.js');

const uploadDocumentsRequest = async (riderId, documents) => {
    try {
        // Define the fields to be uploaded
        const fields = [ 'aadharCardFront', 'aadharCardBack', 'panCard', 'drivingLicenceFront', 'drivingLicenceBack', 'vehicleRCFront', 'vehicleRCBack', 'bankPassbook', 'insuranceDocument' ];

        // Upload documents to Cloudinary
        const uploadedDocuments = await Promise.all(
            fields.map(field => uploadImage(documents[field][0].path))
        );

        // Create the document object dynamically
        const documentData = fields.reduce((acc, field, index) => {
            acc[field] = uploadedDocuments[index].secure_url;
            return acc;
        }, { riderId });

        // Save the documents to the database
        const documentEntry = new documentsModel(documentData);
        const documentsData = await documentEntry.save();

        return { status: true, message: 'Documents uploaded successfully', data: documentsData };
    } catch (error) {
        console.error("Error uploading documents to Cloudinary:", error);
        return { status: false, message: 'Failed to upload documents to Cloudinary', data: {} };
    }
}

module.exports = { uploadDocumentsRequest };
