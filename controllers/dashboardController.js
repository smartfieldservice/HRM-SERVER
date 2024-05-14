//@external module
const asyncHandler = require('express-async-handler');

//@internal module
const { Department, 
        User, 
        Concern } = require('../models/modelExporter');

const totalInformation = asyncHandler( async(req, res) => {

    try {

        let departments, employees, concerns;

        if(req.account.role === "hr"){
            //@hr
            departments = await Department.find({ });
            employees = await User.find({ });
            concerns = await Concern.find({ });
        }else{
            //@branch-hr
            concerns = await Concern.find({ _id : req.account.concernId });
            departments = await Department.find({ concernId : req.account.concernId });
            employees = await User.find({ concernId : req.account.concernId });
        }
        res.status(200).json({ concern : `${concerns.length}`, department : `${departments.length}`, employee : `${employees.length}`});

    } catch (error) {
        res.status(404).json({ message: error});
    }
});

//@exports
module.exports = { totalInformation }