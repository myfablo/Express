const { check } = require('express-validator');

const validateVehicleDetails = [
    check('riderId')
        .notEmpty().withMessage('Rider ID is required'),

    check('vehicleType')
        .isIn(['car', 'bike', 'scooter', 'bicycle']).withMessage('Invalid vehicle type')
        .notEmpty().withMessage('Vehicle type is required'),

    check('registrationNumber')
        .isString().withMessage('Registration number must be a string')
        .notEmpty().withMessage('Registration number is required'),

    check('drivingLicenceNumber')
        .isString().withMessage('Driving licence number must be a string')
        .notEmpty().withMessage('Driving licence number is required'),

    check('insuranceNumber')
        .isString().withMessage('Insurance number must be a string')
        .notEmpty().withMessage('Insurance number is required'),

    check('insuranceCompany')
        .isString().withMessage('Insurance company must be a string')
        .notEmpty().withMessage('Insurance company is required')
];

const validateGetUpdateDelete = [
    check('riderId')
    .notEmpty().withMessage('Rider ID is required!'),
]

module.exports = { validateVehicleDetails, validateGetUpdateDelete };
