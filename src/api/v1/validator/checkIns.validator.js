const { check } = require('express-validator');

const getByRiderIdValidator = [
    check('riderId')
        .notEmpty().withMessage('Rider ID is required!')
];

const getByCheckInIdValidator = [
    check('checkInId')
        .notEmpty().withMessage('Check-In ID is required!')
];

const addCheckInValidator = [
    check('riderId')
        .notEmpty().withMessage('Rider ID is required!'),
    check('checkInKiloMeters')
        .isNumeric().withMessage('Check-In Kilometers must be a number')
];

const addCheckOutValidator = [
    check('riderId')
        .notEmpty().withMessage('Rider ID is required!'),
    check('checkInKiloMeters')
        .isNumeric().withMessage('Check-In Kilometers must be a number'),
    check('checkInOutId')
        .notEmpty().withMessage('Check-In/Out ID is required')
];

const deleteDataValidator = [
    check('riderId')
        .notEmpty().withMessage('Rider ID is required!'),
    check('checkInOutId')
        .notEmpty().withMessage('Check-In/Out ID is required')
];

module.exports = {
    getByRiderIdValidator,
    getByCheckInIdValidator,
    addCheckInValidator,
    addCheckOutValidator,
    deleteDataValidator
};
