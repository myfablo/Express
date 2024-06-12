const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware.js")
const { loginUser } = require('../controllers/auth.controller.js');
const { loginUserValidator } = require("../validators/auth.validator.js");



router.post('/login', loginUserValidator, loginUser)


module.exports = router