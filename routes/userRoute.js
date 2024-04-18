//@external module
const express = require("express");
const router = express.Router();
const multer = require('multer');

//@internal module
const { userController } = require("../controllers/controllerExporter");
const { s3Handler, 
        accountValidation } = require("../middlewares/middlwareExporter");

const upload = multer({
    storage : s3Handler.storageConfig
});

router
    .route("/")
    //@api/users?page=&limit=&sort=
    .get(userController.allUsers)
    //@api/users
    .post(upload.single("imagePath"), userController.createUser)
    //@api/users?id=<user_id>
    .put(userController.editUser)
    .delete(userController.deleteUser)

router
    .route("/login")
    //@api/users/login
    .post(userController.loginUser)

router
    .route("/my-profile")
    //@api/users/my-profile
    .get(userController.ownProfile)

router
    .route("/profile")
    //@api/users/profile?id=<user_id>
    .get(userController.otherProfile)

module.exports = router;