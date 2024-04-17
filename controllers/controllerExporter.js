const userController = require("../controllers/userController");
const concernController = require("../controllers/concernController");
const leaveController = require("../controllers/leaveController");
const leavePerYearController = require("../controllers/leavePerYearController");
const departmentController = require("../controllers/departmentController");
const documentController = require("../controllers/documentController");
const employeeController = require("../controllers/employeeController");
const expenseController = require("../controllers/expenseController");

module.exports = {  userController,
                    concernController,
                    leaveController,
                    leavePerYearController,
                    departmentController,
                    documentController,
                    employeeController,
                    expenseController    
                }

