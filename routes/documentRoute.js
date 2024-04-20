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
    //@api/document?page=1&limit=3&sort=
    .get(documentController.allDocument)
    //@api/document
    .post(upload.array('filesName', 5), documentController.createDocument)
    //@api/document?id=<document_id>
    .put(documentController.editDocument)
    .delete(documentController.deleteDocument)

//@exports
module.exports = router;