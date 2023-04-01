const express = require("express");
const router = express.Router();

const {
    createUser,
} = require("../controllers/userController");


//@Admin only create user and get All User.
router
    .route("/")
    .post(createUser);


module.exports = router;