//@external module
const express = require("express");
const router = express.Router();
const multer = require('multer');

//@internal module
const { concernController } = require("../controllers/controllerExporter");
const { s3Handler } = require("../middlewares/middlwareExporter");

const upload = multer({
    storage : s3Handler.storageConfig
});

router
    .route("/")
    .get(concernController.allConcern)
    .post(upload.single('logo'), concernController.createConcern)
    .put(concernController.editConcern)
    .delete(concernController.deleteConcern)

module.exports = router