//@external module
const express = require("express");
const router = express.Router();

//@internal module
const { leaveController } = require("../controllers/controllerExporter");

router
    .route("/search/:clue")
    .get(leaveController.searchLeave)

router
    .route("/")
    .get(leaveController.allLeave)
    .post(leaveController.createLeave)
    .put(leaveController.editLeave)
    .delete(leaveController.deleteLeave)

//@exports    
module.exports = router;