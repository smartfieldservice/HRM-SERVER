const asyncHandler = require('express-async-handler');
const Leave = require('../models/LeaveModel');


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

const deleteLeave = asyncHandler(async (req, res) => {
    const findleave = await Leave.findById(req.params.Id);
    if(findleave){
        await Leave.deleteOne({ _id: findleave._id });
        res.json({ message: "Leave delete Successfully"});
    }else{
        res.status(404);
        throw new Error("Leave not found");
    }
})

module.exports = { PostLeave, AllleaveData, deleteLeave };