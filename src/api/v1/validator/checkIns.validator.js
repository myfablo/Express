const { check } = require('express-validator');

const validateByRiderId = [
    check('riderId')
        .notEmpty().withMessage('Rider ID is required!')
];

const validateByCheckInId = [
    check('checkInId')
        .notEmpty().withMessage('Check-In ID is required!')
];

const validateCheckIn = [
    check('riderId')
        .notEmpty().withMessage('Rider ID is required!'),
    check('checkInKiloMeters')
        .isNumeric().withMessage('Check-In Kilometers must be a number')
];

const validateCheckOut = [
    check('riderId')
        .notEmpty().withMessage('Rider ID is required!'),
    check('checkInKiloMeters')
        .isNumeric().withMessage('Check-In Kilometers must be a number'),
    check('checkInOutId')
        .notEmpty().withMessage('Check-In/Out ID is required')
];

const validateDeleteRider = [
    check('riderId')
        .notEmpty().withMessage('Rider ID is required!'),
    check('checkInOutId')
        .notEmpty().withMessage('Check-In/Out ID is required')
];

module.exports = {
    validateByRiderId,
    validateByCheckInId,
    validateCheckIn,
    validateCheckOut,
    validateDeleteRider
};
