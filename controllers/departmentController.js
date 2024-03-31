const asyncHandler = require('express-async-handler');
const Department = require('../models/Department');
const { escapeString } = require('../utils/common');


// @desc Post Employee
// @route Post /api/department
// @access Private

const searchDeparment = async(req, res) => {
    
    try {
        
        const searchQuery = new RegExp(escapeString(req.params.dep));

        if(req.params.dep !== ""){
            const departmentData = await Department.find({
                $or : [{departmentName : searchQuery }]
            });

            res.status(201).json({message : `${departmentData} department found !`,departmentData});
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// @desc add new Depratment
// @access Private

const PostDepartment = asyncHandler(async (req, res) => {
    const DepartmentData = new Department({
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

// @desc all Depratment
// @access Private

const AllDepartment = asyncHandler(async(req, res) => {
    try{
        const departmentalldata = await Department.find();
        res.status(200);
        res.json(departmentalldata);
    }catch(error){
        res.json({ message: error});
    }
});


// @desc edit Depratment
// @access Private

const editDepartment = async(req, res) => {
    
    try {

        const departmentData = await Department.findOne({_id : req.query.Id});

        if(departmentData){

            const editDepartment = await Department.findByIdAndUpdate({
                    _id : req.query.Id
                },{
                    departmentName: req.body.departmentName,
                    Description: req.body.Description
                },{
                    new : true
            });

            res.status(201).json({message : "Edited Successfully !", editDepartment});

        }else{
            throw new Error("Data not found !");
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// @desc delete Depratment
// @access Private

const deleteDepartment = asyncHandler(async (req, res) => {
    const user = await Department.findById(req.params.Id);
    if(user) {
        await Department.deleteOne({ _id: user._id });
        res.json({ message: "Department delete successfully" });
    }else{
        res.status(404);
        throw new Error("Department not found");
    }
});


module.exports = { PostDepartment, 
                    AllDepartment, 
                    deleteDepartment, 
                    editDepartment, 
                    searchDeparment 
                };