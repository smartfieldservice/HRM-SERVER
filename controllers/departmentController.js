//@external module
const asyncHandler = require('express-async-handler');
const { isValidObjectId } = require('mongoose');

//@internal module
const { Department, 
        Concern } = require('../models/modelExporter');
const { escapeString, 
        generateSlug, 
        pagination } = require('../utils/common');



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

//@http://localhost:8000/api/department/concern?id=<concern_id>
//@access Private
const concernWiseDepartment = asyncHandler(async(req, res) => {

    try {

        if(!isValidObjectId(req.query.id)){

            res.status(409).json({ message : "Invalid department Id" });
        
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
// @access hr/branch-hr
const allDepartment = asyncHandler(async(req, res) => {
    
    try{   

        const concern = undefined; 
        
        //@after giving the role then use it as concern
        //await Concern.findOne({ slug : req.account.concern }).select("_id");

        let departments;

        if(!concern){
            //@hr
            departments = Department.find({ });
        }else{
            //@branch-hr
            departments = Department.find({ concernId : concern });
        }
        
        departments = departments.populate({ path : 'concernId', select : ['name']});
        
        let sortBy = "-createdAt";
        if(req.query.sort){
            sortBy = req.query.sort.replace(","," ");
        }

        departments = departments.sort(sortBy);

        departments = await pagination(req.query.page, req.query.limit, departments);

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

        if(!isValidObjectId(req.query.id)){

            res.status(409).json({ message : "Invalid department Id" });

        }else{

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
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// @desc delete Depratment
// @access Private
const deleteDepartment = asyncHandler(async (req, res) => {

    try {

        if(!isValidObjectId(req.query.id)){

            res.status(409).json({ message : "Invalid department Id" });

        }else{

            const department = await Department.findById({ _id : req.query.id });

            if(!department){
                res.status(404).json({ message : "Not found" });
            }else{
                await Department.findByIdAndDelete({ _id : req.query.id });
                res.status(200).json({ message : "Deleted successfully" });
            }
        }        
    }catch(error){
        res.status(400).json({ message : error.message });
    }

});

module.exports = {  searchDeparment, 
                    concernWiseDepartment,
                    allDepartment,
                    createDepartment, 
                    editDepartment,
                    deleteDepartment
                };