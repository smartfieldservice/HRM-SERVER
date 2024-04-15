//@external module
const express = require("express");
const router = express.Router();
const multer = require("multer");

//@internal module
const { documentController } = require("../controllers/controllerExporter");
const { s3Handler } = require("../middlewares/middlwareExporter");

const upload = multer({
    storage : s3Handler.storageConfig
})

router
    .route("/")
    .get(documentController.allDocument)
    .post(upload.array('filesName', 5), documentController.createDocument)
    .delete(documentController.deleteDocument)

/* router.route("/all").get(allDocument);
router.route("/search/:doc").get(searchDocument);
router.route("/").get(isLogin,requiredRole(["Admin"])).
                post(fileUploader("Document"),addDocument).
                put(fileUploader("Document"),editDocument).
                delete(deleteDocument);
router.route("/title").get(singleDocumentView); */

//@exports
module.exports = router;