const { check } = require('express-validator');

const validateDocumentsUpload = [
    check('riderId')
        .notEmpty().withMessage('Rider ID is required!'),

    check('aadharCardFront')
        .custom((value, { req }) => {
            if (!req.files || !req.files.aadharCardFront) {
                throw new Error('Aadhar Card Front is required!');
            }
            return true;
        }),

    check('aadharCardBack')
        .custom((value, { req }) => {
            if (!req.files || !req.files.aadharCardBack) {
                throw new Error('Aadhar Card Back is required!');
            }
            return true;
        }),

    check('panCard')
        .custom((value, { req }) => {
            if (!req.files || !req.files.panCard) {
                throw new Error('PAN Card is required!');
            }
            return true;
        }),

    check('drivingLicenceFront')
        .custom((value, { req }) => {
            if (!req.files || !req.files.drivingLicenceFront) {
                throw new Error('Driving Licence Front is required!');
            }
            return true;
        }),

    check('drivingLicenceBack')
        .custom((value, { req }) => {
            if (!req.files || !req.files.drivingLicenceBack) {
                throw new Error('Driving Licence Back is required!');
            }
            return true;
        }),

    check('vehicleRCFront')
        .custom((value, { req }) => {
            if (!req.files || !req.files.vehicleRCFront) {
                throw new Error('Vehicle RC Front is required!');
            }
            return true;
        }),

    check('vehicleRCBack')
        .custom((value, { req }) => {
            if (!req.files || !req.files.vehicleRCBack) {
                throw new Error('Vehicle RC Back is required!');
            }
            return true;
        }),

    check('bankPassbook')
        .custom((value, { req }) => {
            if (!req.files || !req.files.bankPassbook) {
                throw new Error('Bank Passbook is required!');
            }
            return true;
        }),

    check('insuranceDocument')
        .custom((value, { req }) => {
            if (!req.files || !req.files.insuranceDocument) {
                throw new Error('Insurance Document is required!');
            }
            return true;
        })
];

const validateGetUpdateDelete = [
    check('riderId')
    .notEmpty().withMessage('Rider ID is required!'),
]

module.exports = { validateDocumentsUpload, validateGetUpdateDelete };
