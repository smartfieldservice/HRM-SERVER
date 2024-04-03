const express = require("express");
const router = express.Router();

const { departmentController } = require("../controllers/controllerExporter");
const { accountValidation } = require("../middlewares/middlwareExporter");

router
    .use(accountValidation.isLogin,accountValidation.requiredRole(['hr','branch-hr']))

router
    .route("/concern/")
    .get(departmentController.concernWiseDepartment);

router
    .route("/")
    .get(departmentController.allDepartment)
    .post(departmentController.createDepartment)
    .put(departmentController.editDepartment)
    .delete(departmentController.deleteDepartment)
    
module.exports = router;