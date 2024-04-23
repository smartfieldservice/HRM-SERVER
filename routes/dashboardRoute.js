//@external module
const router = require("express").Router();

//@internal module
const { dashboardController } = require("../controllers/controllerExporter");

router
    .route("")
    .get(dashboardController.totalInformation);

//@exports
module.exports = router;