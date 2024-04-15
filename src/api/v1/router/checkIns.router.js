const express = require("express");
const router = express.Router();
const { checkInFxn ,checkOutFxn} = require("../controller/checkIns.controller.js");
const upload = require("../middlewares/multer.middleware.js"); // Assuming you have a separate upload middleware file

router.post("/inDetails", upload.single("checkInImage"), checkInFxn);

router.post("/outDetails",upload.single('checkOutImage'),checkOutFxn)

module.exports = router;