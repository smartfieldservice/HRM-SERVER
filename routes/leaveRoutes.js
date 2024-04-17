//@external module
const express = require("express");
const router = express.Router();

//@internal module
const { leaveController } = require("../controllers/controllerExporter");

router
    .route("/")
    .get(leaveController.allLeave)
    .post(leaveController.createLeave)
    .put(leaveController.editLeave)
    .delete(leaveController.deleteLeave)

/* 
router.route("/:str").get(searchLeave);

router.route("/")
    .post(PostLeave)
    .get(AllleaveData);

router.route("/:Id")
    .delete(deleteLeave);

router.route("/edit").put(editLeave);
 */
module.exports = router;