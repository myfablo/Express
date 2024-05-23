const express = require("express");
const router = express.Router();
const {
  addCheckIn,
  addCheckOut,
  updateCheckIn,
  updateCheckOut,
  deleteCheckIn,
  deleteCheckOut,
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

// Add update check-out route
router.post(
  "/update-CheckOut",
  // authenticateRider,
  upload.single("checkOutImage"),
  updateCheckOut
);

// Add delete check-In route
router.delete("/delete-CheckIn", deleteCheckIn);

// Add delete check-Out route
router.delete("/delete-CheckOut", deleteCheckOut);

module.exports = router;
