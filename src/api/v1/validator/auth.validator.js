const { check } = require('express-validator')

const registerRiderValidator = [
    check('fullName', 'fullName is required!').notEmpty(),
    check('DOB', 'DOB is required!').notEmpty(),
    check('password', 'password is required!').notEmpty(),
    check('Gender', 'Gender is required!').notEmpty(),
    check('operationCity', 'operationCity is required!').notEmpty(),
    check('currentAddress', 'currentAddress is required!').notEmpty(),
    check('permanentAddress', 'permanentAddress is required!').notEmpty(),
    check('email', 'Please provide a valid Email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('phoneNumber', 'phoneNumber is required!').isMobilePhone()

]


module.exports  = { registerRiderValidator, }