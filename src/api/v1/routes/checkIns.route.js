const express = require("express");
const router = express.Router();
const { addCheckIn, addCheckOut, getDetailsByRiderId, getDetailsByCheckInId, deleteData } = require("../controller/checkIns.controller.js");
const upload = require("../middlewares/multer.middleware.js");
const { authenticateRider } = require("../middlewares/authToken.middleware.js");
const { getByRiderIdValidator, getByCheckInIdValidator, addCheckInValidator, addCheckOutValidator, deleteDataValidator } = require('../validator/checkIns.validator.js')



router.get("/get-Details-By/:riderId", authenticateRider, getByRiderIdValidator, getDetailsByRiderId);
router.get("/get-Details/:checkInId", authenticateRider, getByCheckInIdValidator, getDetailsByCheckInId);
router.post("/in-Details", authenticateRider, addCheckInValidator, upload.single("checkInImage"), addCheckIn);
router.post("/out-Details", authenticateRider, addCheckOutValidator, upload.single("checkOutImage"), addCheckOut);
router.delete("/delete-Data", authenticateRider, deleteDataValidator, deleteData);

module.exports = router;
