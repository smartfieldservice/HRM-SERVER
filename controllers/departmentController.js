//@external module
const asyncHandler = require('express-async-handler');
const { isValidObjectId } = require('mongoose');

//@internal module
const { Department } = require('../models/modelExporter');
const { generateSlug, 
        pagination, 
        escapeString} = require('../utils/common');

//@desc get concern wise department
//@route Get /api/department/concern?id=<concern_id>
//@access hr/branch-hr
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

//@desc get all department
//@route Get /api/department?page=&limit=&sort=
//@access hr/branch-hr
const allDepartment = asyncHandler(async(req, res) => {
    
    try{   

        let concernId = undefined; 
        
        //@after giving the role then use it as concernId
        //concernId = req.account.concernId;

        let departments;

        if(!concernId){
            //@hr
            departments = Department.find({ });
        }else{
            //@branch-hr
            departments = Department.find({ concernId });
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
        res.status(404).json({ message: error});
    }
});

//@desc create new Depratment
//@route Post /api/department
//@access hr/branch-hr
const  createDepartment = asyncHandler(async (req, res) => {

    try {

        const { concernId, name, description } = req.body;

        const slug = generateSlug(name);

        let department = await Department.findOne({ $and : [ 
                { concernId }, 
                { slug }
            ] 
        });

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

//@desc edit Depratment
//@route Post /api/department?id=<department_id>
//@access hr/branch-hr
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

//@desc delete Depratment
//@route Post /api/department?id=<department_id>
//@access hr/branch-hr
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

//@desc search Depratment
//@route Post /api/department?id=<department_id>
//@access hr/branch-hr
const searchDepartment = asyncHandler( async(req, res) => {

    try {
        
        const  searchQuery = new RegExp( escapeString( req.params.clue ), "i" );

        if( req.params.clue !== ""){

            const departments = await Department.aggregate([
                {
                  $lookup: {
                    from: "concerns", 
                    localField: "concernId",
                    foreignField: "_id",
                    as: "concern"
                  }
                },
                {
                  $match: {
                    $or: [
                      { 'concern.name': searchQuery },
                      { name: searchQuery },
                      { description: searchQuery }
                    ]
                  }
                }
              ]);

            res.status(200).json({ message : `${departments.length} result found !`, data : departments });
        }

    } catch (error) {
        res.status(400).json({ message : error.message });        
    }

});

//@exports
module.exports = {  concernWiseDepartment,
                    allDepartment,
                    createDepartment, 
                    editDepartment,
                    deleteDepartment,
                    searchDepartment
                };