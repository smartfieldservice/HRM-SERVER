const express = require("express");
const router = express.Router();

const { PostLeave } = require("../controllers/leaveController");

router.route("/")
    .post(PostLeave);


module.exports = router;