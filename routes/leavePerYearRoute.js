//@external module
const express = require("express");
const router = express.Router();

//@internal module
const { leavePerYearController } = require("../controllers/controllerExporter");

router
    .route("/")
    .post(leavePerYearController.createLeavePerYear)
    .put(leavePerYearController.editLeavePerYear)

//@exports
module.exports = router;