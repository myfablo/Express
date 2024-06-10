const { check } = require('express-validator')

const registerRiderValidator = [
    check('fullName')
        .notEmpty().withMessage('Full Name is required!'),
    
    check('DOB')
        .notEmpty().withMessage('Date of Birth (DOB) is required!'),
    
    check('password')
        .notEmpty().withMessage('Password is required!')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    
    check('gender')
        .notEmpty().withMessage('gender is required!'),
    
    check('operationCity')
        .notEmpty().withMessage('Operation City is required!'),
    
    check('currentAddress')
        .notEmpty().withMessage('Current Address is required!'),
    
    check('permanentAddress')
        .notEmpty().withMessage('Permanent Address is required!'),
    
    check('email')
        .isEmail().withMessage('Please provide a valid Email')
        .normalizeEmail({
            gmail_remove_dots: true
        }),
    
    check('phoneNumber')
        .isMobilePhone('en-IN').withMessage('Please provide a valid Indian phone number')
        .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits')
];

const loginRiderValidation = [
    check('password')
        .notEmpty().withMessage('Password is required!')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('email')
        .isEmail().withMessage('Please provide a valid Email')
        .normalizeEmail({
            gmail_remove_dots: true
        }),
    
    check('phoneNumber')
        .isMobilePhone('en-IN').withMessage('Please provide a valid phone number')
        .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits')
]

module.exports  = { registerRiderValidator, }