//@external module
const express = require("express");
const router = express.Router();

//@internal module
const { isLogin, 
        requiredRole } = require("../middlewares/accountValidation");
const { fileUploader } = require("../middlewares/fileUploadHandler");
const { addDocument, 
        deleteDocument, 
        editDocument,
        allDocument,
        searchDocument,
        singleDocumentView} = require("../controllers/documentController");

router.route("/all").get(allDocument);
router.route("/search/:doc").get(searchDocument);
router.route("/").get(isLogin,requiredRole(["Admin"])).
                post(fileUploader("Document"),addDocument).
                put(fileUploader("Document"),editDocument).
                delete(deleteDocument);
router.route("/title").get(singleDocumentView);

//@exports
module.exports = router;