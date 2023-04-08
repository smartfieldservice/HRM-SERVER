const express = require("express");
const router = express.Router();

const {
    authUser,
    createUser,
} = require("../controllers/userController");


//@Admin only create user and get All User.
router
    .route("/")
    .post(createUser);


//Login route for all user
router.post("/login", authUser);

module.exports = router;