const express = require("express");
const router = express.Router();

const { PostLeave, AllleaveData, deleteLeave, searchLeave, editLeave } = require("../controllers/leaveController");

router.route("/:str").get(searchLeave);

router.route("/")
    .post(PostLeave)
    .get(AllleaveData);

router.route("/:Id")
    .delete(deleteLeave);

router.route("/edit").put(editLeave);

module.exports = router;