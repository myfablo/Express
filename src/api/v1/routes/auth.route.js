const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware.js")
const { registerRider} = require('../controller/auth.controller.js');
const { registerRiderValidator } = require("../validator/auth.validator.js");



router.post('/register', registerRiderValidator, registerRider)


module.exports = router