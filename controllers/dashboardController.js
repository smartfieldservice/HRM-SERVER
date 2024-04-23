//@external module
const asyncHandler = require('express-async-handler');
const { Department, User, Concern } = require('../models/modelExporter');

const totalInformation = asyncHandler( async(req, res) => {

    try {
        
        let concernId = undefined;

        //@after giving the role then use it as concernId
        //concernId = req.account.concernId;

        let departments, employees, concerns;

        if(!concernId){
            //@hr
            departments = await Department.find({ });
            employees = await User.find({ });
            concerns = await Concern.find({ });

        }else{
            //branch-hr
            departments = await Department.find({ concernId });
            employees = await User.find({ concernId });
        }
        res.status(200).json({ concern : `${concerns.length} concerns found !`, department : `${departments.length} departments found !`, employee : `${employees.length} employees found !`});

    } catch (error) {
        res.status(404).json({ message: error});
    }

});

//@exports
module.exports = { totalInformation }