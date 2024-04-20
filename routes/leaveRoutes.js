//@external module
const express = require("express");
const router = express.Router();

//@internal module
const { leaveController } = require("../controllers/controllerExporter");

router
    .route("/search/:clue")
    //@api/leave/search/test
    .get(leaveController.searchLeave)

router
    .route("/")
    //@api/leave?page=&limit=&sort=
    .get(leaveController.allLeave)
    //@api/leave
    .post(leaveController.createLeave)
    //@api/leave?id=<leave_id>
    .put(leaveController.editLeave)
    .delete(leaveController.deleteLeave)

//@exports    
module.exports = router;