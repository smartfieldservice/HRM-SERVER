const express = require("express");
const router = express.Router();

const { PostDepartment, AllDepartment, deleteDepartment, editDepartment, searchDeparment } = require("../controllers/departmentController");

router.route("/:dep").get(searchDeparment);

router.route("/")
    .post(PostDepartment)
    .get(AllDepartment);

router.route("/:Id")
    .delete(deleteDepartment)
    .put(editDepartment);

module.exports = router;