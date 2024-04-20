//@external module
const router = require("express").Router();

//@internal module
const { leaveController } = require("../controllers/controllerExporter");
const { accountValidation } = require("../middlewares/middlwareExporter");

router
    .route("/search/:clue")
    //@api/leave/search/test
    .get(leaveController.searchLeave)

/* router
    .use(accountValidation.isLogin, accountValidation.requiredRole(['hr', 'branch-hr']));
*/

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