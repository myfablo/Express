const { check } = require('express-validator')

const authUserValidator = [
    check('userType')
    .notEmpty().withMessage('userType is required!')
    .isIn(['rider', 'customer', 'mrWhiteHatHacker']).withMessage('Invalid userType value!'),
    
    check('password')
        .notEmpty().withMessage('Password is required!')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    
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
    
    check('phone')
        .isMobilePhone('en-IN').withMessage('Please provide a valid phone number')
       // .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits')
]

module.exports  = { authUserValidator, }