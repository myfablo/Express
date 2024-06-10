const { check } = require('express-validator')

const getByRiderIdValidator = [
    check('riderId', 'rider Id is required!').notEmpty()
]

const getByCheckInIdValidator = [
    check('checkInId', 'checkIn Id is required!').notEmpty()
]

const addCheckInValidator = [
    check('riderId', 'rider Id is required!').notEmpty(),
    check('checkInKiloMeters', 'checkInKiloMeters must be a number').isNumeric()
]

const addCheckOutValidator = [
    check('riderId', 'rider Id is required!').notEmpty(),
    check('checkInKiloMeters', 'checkInKiloMeters must be a number').isNumeric(),
    check('checkInOutId', 'checkInOutId is required').notEmpty()
]


const deleteDataValidator = [
    check('riderId', 'rider Id is required!').notEmpty(),
    check('checkInOutId', 'checkInOutId is required').notEmpty()
]


module.exports = { getByRiderIdValidator, getByCheckInIdValidator, addCheckInValidator, addCheckOutValidator, deleteDataValidator }