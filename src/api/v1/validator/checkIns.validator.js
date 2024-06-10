const { check } = require('express-validator')

const getByRiderIdValidator = [
    check('riderId', 'rider Id is required!').not().isEmpty()
]

const getByCheckInIdValidator = [
    check('checkInId', 'checkIn Id is required!').not().isEmpty()
]

const addCheckInValidator = [
    check('riderId', 'rider Id is required!').not().isEmpty(),
    check('checkInKiloMeters', 'checkInKiloMeters must be a number').isNumeric()
]

const addCheckOutValidator = [
    check('riderId', 'rider Id is required!').not().isEmpty(),
    check('checkInKiloMeters', 'checkInKiloMeters must be a number').isNumeric(),
    check('checkInOutId', 'checkInOutId is required').not().isEmpty()
]


const deleteDataValidator = [
    check('riderId', 'rider Id is required!').not().isEmpty(),
    check('checkInOutId', 'checkInOutId is required').not().isEmpty()
]


module.exports = { getByRiderIdValidator, getByCheckInIdValidator, addCheckInValidator, addCheckOutValidator, deleteDataValidator }