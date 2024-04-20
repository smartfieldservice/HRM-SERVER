//@external module
const express = require("express");
const router = express.Router();

//@internal module
const { leavePerYearController } = require("../controllers/controllerExporter");

router
    .route("/")
    //@api/leave-per-year?page=&limit=&sort=
    .get(leavePerYearController.allLeavePerYear)
    //@api/leave-per-year
    .post(leavePerYearController.createLeavePerYear)
    //@api/leave-per-year?id=<leave_per_year_id>
    .delete(leavePerYearController.deleteLeavePerYear)

//@exports
module.exports = router;