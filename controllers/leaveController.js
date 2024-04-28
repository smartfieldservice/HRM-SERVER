//@external module
const asyncHandler = require('express-async-handler');
const { ObjectId } = require('mongodb');

//@internal module
const { Leave, 
        TotalLeaveOfUser } = require('../models/modelExporter');
const { escapeString, 
        pagination } = require('../utils/common');
const { isValidObjectId } = require('mongoose');

//@desc display all Leave
//@route Get /api/leave/search/:clue
//@access hr/branch-hr
const searchLeave = asyncHandler(async(req, res) => {
    
    try {

        if(req.params.str !== ""){

            const searchQuery = new RegExp( escapeString(req.params.clue), "i");

            let role = "hr"; 

            //console.log(req.account);
        
            //@after giving route protection 
            //role = req.account.role;

            let leaves;

            if(role === "hr"){
                //@hr
                leaves = await Leave.aggregate([
                    {
                        $lookup: {
                            from: "concerns", 
                            localField: "concernId",
                            foreignField: "_id",
                            as: "concern"
                        }
                    },{
                        $lookup: {
                            from: "departments", 
                            localField: "departmentId",
                            foreignField: "_id",
                            as: "department"
                        }
                    },{
                        $lookup: {
                            from: "users", 
                            localField: "employeeId",
                            foreignField: "_id",
                            as: "user"
                        }
                    },{
                        $match: {
                            $or: [
                                { 'concern.name': searchQuery },
                                { 'department.name': searchQuery },
                                { 'user.name': searchQuery },
                                { leavetype: searchQuery },
                            ]
                        }
                    }
                ]);
            }else{
                //@brach-hr
                leaves = await Leave.aggregate([
                    {
                        $lookup: {
                            from: "departments", 
                            localField: "departmentId",
                            foreignField: "_id",
                            as: "department"
                        }
                    },
                    {
                        $lookup: {
                            from: "users", 
                            localField: "employeeId",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                    {
                        $match: {
                            $and: [
                                { concernId : new ObjectId( req.account.concernId ) },
                                { 
                                    $or: [
                                        { 'department.name': searchQuery },
                                        { 'user.name': searchQuery },
                                        { leavetype: searchQuery }
                                    ]
                                }
                            ]
                        }
                    }
                ]);
            }
            res.status(200).json({ message : `${leaves.length} result found !`, data : leaves });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//@desc display all Leave
//@route Get /api/leave?page=&limit=&sort=
//@access hr/branch-hr
const allLeave = asyncHandler(async(req, res) => {
    
    try{

        let role = "hr"; 

        //console.log(req.account)
        
        //@after giving route protection 
        //role = req.account.role;

        let leaves;
        
        if(role === "hr"){
            //@hr
            leaves = Leave.find({ });
        }else{
            //@brach-hr
            leaves = Leave.find({ concernId : req.account.concernId });
        }

        leaves = leaves.populate({ path : 'concernId departmentId employeeId', 
                                select : 'name name name'});

        let sortBy = "-createdAt";
        if(req.query.sort){
            sortBy = req.query.sort.replace(","," ");
        }

        leaves = leaves.sort(sortBy);
        leaves = await pagination(req.query.page, req.query.limit, leaves);

        res.status(200).json({ message : `${leaves.length} leaves found`, data : leaves });
    
    }catch(error){
       res.status(400).json({ message : error.message });
    }
});

//@desc create Leave
//@route Post /api/leave
//@access hr/branch-hr
const createLeave = asyncHandler(async (req, res) => {
    
    try {
        
        const { concernId, departmentId, employeeId, duration, 
            leavetype, startdate, enddate, totaldays, description } = req.body;
        
        const leave =  await Leave.create({
            concernId,
            departmentId,
            employeeId,
            duration,
            leavetype,
            startdate,
            enddate,
            totaldays,
            description
        });

        const employeeLeave = await TotalLeaveOfUser.findOne({ employeeId });

        let addLeaveToEmployee;

        if(employeeLeave){ 

            //@since employee already exist, so just update it
            addLeaveToEmployee = await TotalLeaveOfUser.findOneAndUpdate({
                    employeeId
                },{
                    $inc: {
                        totalSick: leavetype === 'sick' ? totaldays : 0,
                        totalCasual: leavetype === 'casual' ? totaldays : 0
                    }
                },{ 
                    new : true
            });

        }else{

            //@since employee not exist, so add a new record
            addLeaveToEmployee = await TotalLeaveOfUser.create({
                employeeId,
                totalSick: leavetype === 'sick' ? totaldays : 0,
                totalCasual: leavetype === 'casual' ? totaldays : 0
            });
        }
        
        res.status(200).json({ message : "Leave added successfully", data : leave }); 

    } catch (error) {
        res.status(400).json({ message : error.message });
    }
});

//@desc edit Leave
//@route Put /api/leave?id=<leave_id>
//@access hr/branch-hr
const editLeave = asyncHandler(async(req, res) => {

    try {

        if(!isValidObjectId(req.query.id)){

            res.status(409).json({ message : "Invalid leave Id" });
        
        }else{
            let leave = await Leave.findOne({_id : req.query.id});

            if(!leave){
                res.status(404).json({ message : "Not found" });
            }else{
                const { duration, leavetype, startdate, enddate, totaldays, description } = req.body;
                
                await Leave.findByIdAndUpdate({
                    _id : req.query.id 
                },{
                    duration,
                    leavetype,
                    startdate,
                    enddate,
                    totaldays,
                    description
                },{
                    new : true
                });
                
                res.status(200).json({ message : "Edited successfully" });
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//@desc delete Leave
//@route Delete /api/leave?id=<leave_id>
//@access hr/branch-hr
const deleteLeave = asyncHandler(async (req, res) => {

    try {
        
        if(!isValidObjectId(req.query.id)){

            res.status(409).json({ message : "Invalid leave Id" });
        
        }
        else{
            
            const leave = await Leave.findById({ _id : req.query.id });

            if(!leave){
                res.status(404).json({ message : "Not found" });
            }
            else{

                await Leave.findByIdAndDelete({ _id : req.query.id });
                res.status(200).json({ message : "Deleted successfully" });
            }
        }

    } catch (error) {
        res.status(400).status({ message : error.message });
    }

});

//@exports
module.exports = {  searchLeave,
                    createLeave, 
                    allLeave, 
                    deleteLeave,  
                    editLeave
                };