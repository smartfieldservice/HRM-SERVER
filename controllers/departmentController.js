const asyncHandler = require('express-async-handler');
const Department = require('../models/Department');


// @desc Post Employee
// @route Post /api/department
// @access Private

const PostDepartment = asyncHandler(async (req, res) => {
    const DepartmentData = await new Department({
        departmentName: req.body.departmentName,
        Description: req.body.Description
    });
    try{
        const DepartmentForm = await DepartmentData.save();
        res.status(201);
        res.json(DepartmentForm);
    }catch(err){
        res.json({ message: err });
    }
});

const AllDepartment = asyncHandler(async(req, res) => {
    try{
        const departmentalldata = await Department.find();
        res.status(200);
        res.json(departmentalldata);
    }catch(error){
        res.json({ message: error});
    }
});

const deleteDepartment = asyncHandler(async (req, res) => {
    const user = await Department.findById(req.params.Id);
    if(user) {
        await User.deleteOne({ _id: user._id });
        res.json({ message: "User delete successfully" });
    }else{
        res.status(404);
        throw new Error("User not found");
    }
});


module.exports = { PostDepartment, AllDepartment, deleteDepartment };