const { check } = require('express-validator');

const validateRiderOnboarding = [

    check('fullName')
        .notEmpty().withMessage('Full Name is required!')
        .isString().withMessage('Full Name must be a string'),

    check('DOB')
        .notEmpty().withMessage('Date of Birth (DOB) is required!')
        .isString().withMessage('DOB must be a string'),

    check('password')
        .notEmpty().withMessage('Password is required!')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    check('gender')
        .notEmpty().withMessage('Gender is required!')
        .isString().withMessage('Gender must be a string'),

    check('operationCity')
        .isString().withMessage('Operation City must be a string'),

    check('currentAddress')
        .notEmpty().withMessage('Current Address is required!')
        .isString().withMessage('Current Address must be a string'),

    check('permanentAddress')
        .notEmpty().withMessage('Permanent Address is required!')
        .isString().withMessage('Permanent Address must be a string'),

    check('email')
        .isEmail().withMessage('Please provide a valid Email')
        .normalizeEmail({
            gmail_remove_dots: true
        }),

    check('phone')
        .isMobilePhone('en-IN').withMessage('Please provide a valid phone number')
        .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits')
];

module.exports = { validateRiderOnboarding };
