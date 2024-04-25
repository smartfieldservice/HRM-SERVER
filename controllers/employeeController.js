const asyncHandler = require('express-async-handler');
const fs = require('fs');
const util = require('util');
const unlinkfile = util.promisify(fs.unlink);
const path = require('path');
const { uploadFile } = require('../s3');
const Employee = require('../models/Employee');
const { escapeString } = require('../utils/common');


// @desc search Employee
// @access Private

const searchEmployee = async(req, res) => {
    
    try {
        const searchQuery = new RegExp(escapeString(req.params.emp),"i");
        const mobileQuery = new RegExp("^" + escapeString(req.params.emp),"i");

        if(req.params.exp !== ""){
            
            const employeeData = await Employee.find({
                $or : [ {name : searchQuery},
                        {department : searchQuery},
                        {designation : searchQuery},
                        {mobile : mobileQuery}
                    ]
            });

            res.status(200).json({message : `${employeeData.length} employee found !`,employeeData});

        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// @desc Post Employee
// @route Post /api/forms/employee
// @access Private

const PostEmployee = asyncHandler(async (req, res) => {
    
    const file = req.file;
    
    const result = await uploadFile(file);
    await unlinkfile(file.path);
    
    const EmployeeData = new Employee({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        department: req.body.department,
        designation: req.body.designation,
        presentaddress: req.body.presentaddress,
        permanentaddress: req.body.permanentaddress,
        city: req.body.city,
        country: req.body.country,
        imagePath: result.Location,
    });
    try{
        const EmployeeForm = await EmployeeData.save();
        res.status(200);
        res.json(EmployeeForm);
    }catch(err){
        res.json({ message: err });
    }
});

// @desc edit Employee
// @access Private
const editEmployee = async(req, res) => {
    
    try {

        const employeeData = await Employee.findOne({_id : req.query.id});

        if(employeeData){
            const editEmployee = await Employee.findByIdAndUpdate({
                _id : req.query.id
                },{
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    department: req.body.department,
                    designation: req.body.designation,
                    presentaddress: req.body.presentaddress,
                    permanentaddress: req.body.permanentaddress,
                    city: req.body.city,
                    country: req.body.country,
                    imagePath: result.Location,
                },{
                    new : true
            });

            res.status(200).json({message : "Edited Successfully !", editEmployee});
        }else{
            throw new Error("Data not found !");
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {  PostEmployee, 
                    editEmployee, 
                    searchEmployee 
                };