const asyncHandler = require('express-async-handler');
const Leave = require('../models/LeaveModel');


// @desc Post Leave
// @route Post /api/leave
// @access Private

const PostLeave = asyncHandler(async (req, res) => {
    const leaveData = await new Leave({
        employeename: req.body.employeename,
        duration: req.body.duration,
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

module.exports = { PostLeave, AllleaveData };