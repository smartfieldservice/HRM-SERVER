const express = require("express");
const router = express.Router();

const { departmentController } = require("../controllers/controllerExporter");

router
    .route("/concern/")
    .get(departmentController.concernWiseDepartment);

router
    .route("/")
    .get(departmentController.allDepartment)
    .post(departmentController.createDepartment)
    .put(departmentController.editDepartment)
    

module.exports = router;