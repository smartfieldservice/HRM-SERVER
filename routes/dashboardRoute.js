//@external module
const router = require("express").Router();

//@internal module
const { dashboardController } = require("../controllers/controllerExporter");
const { accountValidation } = require("../middlewares/middlwareExporter");

router
    .use(accountValidation.isLogin, accountValidation.requiredRole(["hr", "branch-hr"]));

router
    .route("")
    .get(dashboardController.totalInformation);

//@exports
module.exports = router;