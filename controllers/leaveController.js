//@external module
const asyncHandler = require('express-async-handler');

//@internal module
const Leave = require('../models/Leave');
const { escapeString, 
        generateSlug } = require('../utils/common');

const searchLeave = async(req, res) => {
    try {

        const searchQuery = new RegExp(escapeString(req.params.str),"i");

        if(req.params.str !== ""){
            
            const expenseData = await Leave.find({
                $or : [{employeename : searchQuery},{leavetype : searchQuery}]
            });

            res.status(201).json({message : `${expenseData.length} expense found !`,expenseData});

        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// @desc create Leave
// @route Post /api/leave
// @access hr/branch-hr
const createLeave = asyncHandler(async (req, res) => {
    
    try {
        
        const { employeename, duration, leavetype, totaldays, startdate, enddate, description, status } = req.body;
        const slug = generateSlug(description);
        let leave = await Leave.findOne({ slug });

        if(leave){
            res.status().json({ message : "This leave already added !"});
        }else{

            leave = new Leave({
                employeename,
                duration,
                leavetype,
                totaldays,
                startdate,
                enddate,
                description,
                status,
                slug
            });

            await leave.save();
            res.status(200).json({ message : "Added successfully", leave });
        }   
    } catch (error) {
        res.status(400).json({ message : error.message });
    }
});

const AllleaveData = asyncHandler(async(req, res) => {
    try{
        const leaveallData = await Leave.find();
        res.status(200);
        res.json(leaveallData);
    }catch(err){
        res.json({ message: err});
    }
});

const editLeave = async(req, res) => {
    try {
        const leaveData = await Leave.findOne({_id : req.query.id});

        if(leaveData){
            const editLeave = await Leave.findByIdAndUpdate(
                {
                    _id : req.query.id 
                },{
                    employeename: req.body.employeename,
                    duration: req.body.duration,
                    leavetype: req.body.leavetype,
                    totaldays: req.body.totaldays,
                    startdate: req.body.startdate,
                    enddate: req.body.enddate,
                    description: req.body.description,
                    status: req.body.status
                },{
                    new : true
                });
            
                res.status(201).json({message : "Edited Successfully !", editLeave});
            
        }else{
            throw new Error("Data not found !");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const deleteLeave = asyncHandler(async (req, res) => {
    const findleave = await Leave.findById(req.params.Id);
    if(findleave){
        await Leave.deleteOne({ _id: findleave._id });
        res.json({ message: "Leave delete Successfully"});
    }else{
        res.status(404);
        throw new Error("Leave not found");
    }
});

module.exports = {  createLeave, 
                    AllleaveData, 
                    deleteLeave, 
                    searchLeave, 
                    editLeave };