const express = require("express");
const router = express.Router();

const connectExpressDB = require("../v1/config/mongoose.js");

connectExpressDB();

const checkInRoute = require("./router/checkIns.router.js");
router.use("/checkIns", checkInRoute);

module.exports = router;
