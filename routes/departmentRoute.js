const express = require("express");
const router = express.Router();

const { departmentController } = require("../controllers/controllerExporter");
const { accountValidation } = require("../middlewares/middlwareExporter");

/* router
    .use(accountValidation.isLogin,accountValidation.requiredRole(['hr','branch-hr']))
 */
router
    .route("/concern/")
    //@api/department/concern?id=<concern_id>
    .get(departmentController.concernWiseDepartment);

router
    .route("/")
    //@api/department?page=&limit=&sort=
    .get(departmentController.allDepartment)
    //@api/department
    .post(departmentController.createDepartment)
    //@api/department?id=<department_id>
    .put(departmentController.editDepartment)
    .delete(departmentController.deleteDepartment)
    
module.exports = router;