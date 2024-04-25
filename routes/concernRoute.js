//@external module
const router = require("express").Router();
const multer = require('multer');

//@internal module
const { concernController } = require("../controllers/controllerExporter");
const { s3Handler, 
        accountValidation } = require("../middlewares/middlwareExporter");

const upload = multer({
    storage : s3Handler.storageConfig
});

/* router
    .use(accountValidation.isLogin, accountValidation.requiredRole(['hr'])); */

router
    .route("/")
    //@api/concern?page=&limit=&sort=
    .get(concernController.allConcern)
    //@api/concern
    .post(upload.single('logo'), concernController.createConcern)
    //@api/concern?id=<concern_id>
    .put(concernController.editConcern)
    .delete(concernController.deleteConcern)

router
    .route("/search/:clue")
    //@api/concern/search/attin
    .get(concernController.searchConcern)

module.exports = router