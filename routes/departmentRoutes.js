const express = require("express");
const router = express.Router();

const { PostDepartment, AllDepartment, deleteDepartment } = require("../controllers/departmentController");

router.route("/")
    .post(PostDepartment)
    .get(AllDepartment);

router.route("/:Id")
    .delete(deleteDepartment);

module.exports = router;