const express = require("express");
const router = express.Router();
const { addCheckIn, addCheckOut, getCheckInsByRiderId, getCheckInsByCheckInId, deleteCheckIns } = require("../controller/checkIns.controller.js");
const upload = require("../middlewares/multer.middleware.js");
const { authenticateRider } = require("../middlewares/authToken.middleware.js");
const { validateByRiderId, validateByCheckInId, validateCheckIn, validateCheckOut, validateDeleteRider } = require('../validator/checkIns.validator.js')



router.get("/get-Details-By/:riderId", authenticateRider, validateByRiderId, getCheckInsByRiderId);
router.get("/get-Details/:checkInId", authenticateRider, validateByCheckInId, getCheckInsByCheckInId);
router.post("/in-Details", authenticateRider, validateCheckIn, upload.single("checkInImage"), addCheckIn);
router.post("/out-Details", authenticateRider, validateCheckOut, upload.single("checkOutImage"), addCheckOut);
router.delete("/delete-Data", authenticateRider, validateDeleteRider, deleteCheckIns);

module.exports = router;
