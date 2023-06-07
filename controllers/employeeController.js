const asyncHandler = require('express-async-handler');
const fs = require('fs');
const util = require('util');
const unlinkfile = util.promisify(fs.unlink);
const path = require('path');
const { uploadFile } = require('../s3');
const Employee = require('../models/AddEmployee');


// @desc Post Employee
// @route Post /api/forms/employee
// @access Private

const PostEmployee = asyncHandler(async (req, res) => {
    const file = req.file;
    
    const result = await uploadFile(file);
    await unlinkfile(file.path);
    const EmployeeData = await new Employee({
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
        res.status(201);
        res.json(EmployeeForm);
    }catch(err){
        res.json({ message: err });
    }
});

module.exports = { PostEmployee };