const asyncHandler = require('express-async-handler');
const Leave = require('../models/Leave');
const { escapeString } = require('../utils/common');

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

// @desc Post Leave
// @route Post /api/leave
// @access Private
const PostLeave = asyncHandler(async (req, res) => {
    const leaveData = await new Leave({
        employeename: req.body.employeename,
        duration: req.body.duration,
        leavetype: req.body.leavetype,
        totaldays: req.body.totaldays,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        description: req.body.description,
        status: req.body.status
    });
    try{
        const LeaveForm = await leaveData.save();
        res.status(201);
        res.json(LeaveForm);
    }catch(err){
        res.json({ message: err });
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

module.exports = { PostLeave, AllleaveData, deleteLeave, searchLeave, editLeave };