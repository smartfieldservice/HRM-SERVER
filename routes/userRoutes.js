const express = require("express");
const router = express.Router();

const {
    getUserProfile,
    getSingle,
    getUsers,
    authUser,
    createUser,
    deleteUser,
} = require("../controllers/userController");


//@Admin only create user and get All User.
router
    .route("/")
    .post(createUser)
    .get(getUsers);

//Admin route for single get, put, delete user.
router
    .route("/profile/:userId")
    .get(getSingle)
    .delete(deleteUser);
//Login route for all user
router.post("/login", authUser);

//General user route for only get their profile and update their profile.
router
    .route("/profile")
    .get(getUserProfile);

module.exports = router;