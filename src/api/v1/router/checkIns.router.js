const express = require("express");
const router = express.Router();
const {
  addCheckIn,
  addCheckOut,
} = require("../controller/checkIns.controller.js");
const upload = require("../middlewares/multer.middleware.js"); // Assuming you have a separate upload middleware file

router.post("/inDetails", upload.single("checkInImage"), addCheckIn);

router.post("/outDetails", upload.single("checkOutImage"), addCheckOut);

module.exports = router;
