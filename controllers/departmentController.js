const asyncHandler = require('express-async-handler');
const { Department } = require('../models/modelExporter');
const { escapeString, 
        generateSlug, 
        pagination } = require('../utils/common');
const { isValidObjectId } = require('mongoose');


// @desc Post Employee
// @route Post /api/department
// @access Private

const searchDeparment = async(req, res) => {
    
    try {
        
        const searchQuery = new RegExp(escapeString(req.params.dep));

        if(req.params.dep !== ""){
            const department = await Department.find({
                $or : [{departmentName : searchQuery }]
            });

            res.status(201).json({message : `${department} department found !`,department});
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const concernWiseDepartment = asyncHandler(async(req, res) => {

    try {

        if(!isValidObjectId(req.query.id)){

            res.status(409).json({ message : "Invalid object Id" });
        
        }
        else{

            const departments = await Department.find({ concernId : req.query.id });

            res.status(200).json({ message : `${departments.length} departments found`, data : departments });
        }
    
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});

// @desc all Depratment
// @access super HR

const allDepartment = asyncHandler(async(req, res) => {
    
    try{

        const { page, limit, sort} = req.query;

        let departments = Department.find({});

        let sortBy = "-createdAt";
        if(sort){
            sortBy = sort.replace(","," ");
        }

        departments = await pagination(page, limit, departments);

        res.status(200).json({ message : `${departments.length} departments found`, data : departments });

    }catch(error){
        res.json({ message: error});
    }
});

// @add new Depratment
// @access super HR
const  createDepartment = asyncHandler(async (req, res) => {

    try {

        const { concernId, name, description } = req.body;

        const slug = generateSlug(name);

        let department = await Department.findOne({ slug });

        if(department){
            res.status(409).json({ message : "Already exist" });
        }else{

            department = new Department({
                concernId,
                name,
                description,
                slug
            });

            await department.save();
            res.status(200).json({ message : "Added successfully", department });
        }

    } catch (error) {
        res.status(400).json({ message : error.message });
    }

    
});

// @edit Depratment
// @access Super HR
const editDepartment = async(req, res) => {
    
    try {

        let department = await Department.findById({ _id : req.query.id });
        
        if(!department){
            res.status(404).json({ message : "Not found" });
        }  
        else{

            const { concernId, name, description } = req.body;

            await Department.findByIdAndUpdate({
                    _id : req.query.id
                },{
                    concernId,
                    name,
                    description,
                    slug : generateSlug(name)
                },{
                    new : true
            });

            res.status(200).json({message : "Edited Successfully !"});

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


module.exports = {  createDepartment, 
                    concernWiseDepartment ,
                    allDepartment, 
                    deleteDepartment, 
                    editDepartment, 
                    searchDeparment 
                };