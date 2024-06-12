const express = require("express");
const router = express.Router();

const connectExpressDB = require("../v1/config/mongoose.js");

connectExpressDB();

//..................................check-Ins route......................................................//
const checkInRoute = require("./routes/checkIns.route.js");
router.use("/checkIns", checkInRoute);

//.....................................auth route.........................................................//
const authRoute = require("./routes/auth.route.js")
router.use("/auth", authRoute)

//.....................................vehicle route.........................................................//
const vehicleRoute = require("./routes/vehicle.route.js")
router.use("/vehicle", vehicleRoute)

//.....................................auth route.........................................................//
const documentsRoute = require("./routes/documents.route.js")
router.use("/documents", documentsRoute)

//.....................................auth route.........................................................//
const onboardRoute = require("./routes/onboard.route.js")
//router.use("/onboard", onboardRoute)

module.exports = router;
