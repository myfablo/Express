const express = require("express");
const router = express.Router();
const {
  addCheckIn,
  addCheckOut,
} = require("../controller/checkIns.controller.js");
const upload = require("../middlewares/multer.middleware.js"); // Assuming you have a separate upload middleware file
const authenticateRider = require("../middlewares/auth.middleware.js");

//const upload = uploadMiddleware();
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

// Add update check-in route
router.post(
  "/update-CheckIn",
  // authenticateRider,
  upload.single("checkInImage"),
  updateCheckIn
);

module.exports = router;
