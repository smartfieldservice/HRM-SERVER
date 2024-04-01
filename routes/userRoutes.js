const express = require("express");
const router = express.Router();
const path = require('path');
const multer = require('multer');
const shortid = require('shortid');
const { userController } = require("../controllers/controllerExporter");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(path.dirname(__dirname), './AllFileFolder'))
    },
    filename: function(req, file, cb){
        cb(null, shortid.generate() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage,
    limits: {
        fileSize: 99995242880 // 500KB
    }
});

//@Admin only create user and get All User.
router
    .route("/")
    .get(userController.allUsers)
    .post(upload.single("imagePath"),userController.createUser)
    .put(userController.editUser)
    .delete(userController.deleteUser)

/* //Admin route for single get, put, delete user.
router
    .route("/profile/:userId")
    .get(getSingle)
    .delete(deleteUser);
//Login route for all user
router.post("/login", authUser);

//General user route for only get their profile and update their profile.
router
    .route("/profile")
    .get(getUserProfile)
    .put(updateUserProfile); */

module.exports = router;