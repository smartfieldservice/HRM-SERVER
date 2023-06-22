const express = require("express");
const router = express.Router();

const { PostLeave, AllleaveData, deleteLeave } = require("../controllers/leaveController");

router.route("/")
    .post(PostLeave)
    .get(AllleaveData);

router.route("/:Id")
    .delete(deleteLeave);

module.exports = router;