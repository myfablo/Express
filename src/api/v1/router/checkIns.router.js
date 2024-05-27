const express = require("express");
const router = express.Router();
const {
  addCheckIn,
  addCheckOut,
  getDetailsByRiderId,
  getDetailsByCheckInId,
  deleteData
} = require("../controller/checkIns.controller.js");
const upload = require("../middlewares/multer.middleware.js"); // Assuming you have a separate upload middleware file
const authenticateRider = require("../middlewares/auth.middleware.js");

//const upload = uploadMiddleware();

//Get data by rider Id route
router.get("/get-Details-By/:riderId", getDetailsByRiderId);

//Get data by checkIn-Id route
router.get("/get-Details/:checkInId", getDetailsByCheckInId);

// Add check-in route
router.post(
  "/in-Details",
  //authenticateRider,
  upload.single("checkInImage"),
  addCheckIn
);

// Add check-out route
router.post(
  "/out-Details",
  // authenticateRider,
  upload.single("checkOutImage"),
  addCheckOut
);

//router to delete data;
router.delete("/delete-Data", deleteData);

module.exports = router;
