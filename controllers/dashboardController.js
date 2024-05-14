//@external module
const asyncHandler = require('express-async-handler');

//@internal module
const { Department, 
        User, 
        Concern } = require('../models/modelExporter');

const totalInformation = asyncHandler( async(req, res) => {

    try {

        if (req.account && req.account.role) {

            let departments, employees, concerns;

            if(req.account.role === "hr"){
                //@hr
                departments = await Department.find({ });
                employees = await User.find({ });
                concerns = await Concern.find({ });

            }else if(req.account.role === "branch-hr"){
                //@branch-hr
                concerns = await Concern.find({ _id : req.account.concernId });
                departments = await Department.find({ concernId : req.account.concernId });
                employees = await User.find({ concernId : req.account.concernId });
            
            }else{
               //@employee
               return res.status(400).json({ message: "Bad request" });
            }

            res.status(200).json({ concern : `${concerns.length}`, department : `${departments.length}`, employee : `${employees.length}`});
            
        } else {
            //@unauthorized-person
            return res.status(400).json({ message: "Bad request" });
        }
        
    } catch (error) {
        res.status(404).json({ message: error});
    }
});

//@exports
module.exports = { totalInformation }