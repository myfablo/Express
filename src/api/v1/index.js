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


module.exports = router;
