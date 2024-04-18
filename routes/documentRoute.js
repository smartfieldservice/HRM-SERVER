//@external module
const express = require("express");
const router = express.Router();
const multer = require("multer");

//@internal module
const { documentController } = require("../controllers/controllerExporter");
const { s3Handler } = require("../middlewares/middlwareExporter");

const upload = multer({
    storage : s3Handler.storageConfig
});

router
    .route("/")
    .get(documentController.allDocument)
    .post(upload.array('filesName', 5), documentController.createDocument)
    .put(documentController.editDocument)
    .delete(documentController.deleteDocument)

//@exports
module.exports = router;