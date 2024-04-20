//@external module
const router = require("express").Router();

const { addExpense, deleteExpense, editExpense, searchExpense } = require('../controllers/expenseController');

router.route("/:exp").get(searchExpense);
router.route("/add").post(addExpense);
router.route("/edit").put(editExpense);
router.route("/delete").delete(deleteExpense);

module.exports = router;