const express = require("express");
const router = express.Router();

const {
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

module.exports = router;