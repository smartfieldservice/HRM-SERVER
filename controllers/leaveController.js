//@external module
const asyncHandler = require('express-async-handler');

//@internal module
const { Leave } = require('../models/modelExporter');
const { escapeString, 
        generateSlug, 
        pagination} = require('../utils/common');

const searchLeave = asyncHandler(async(req, res) => {
    try {

        const searchQuery = new RegExp(escapeString(req.params.str),"i");

        if(req.params.str !== ""){
            
            const expenseData = await Leave.find({
                $or : [{ employeename : searchQuery},{leavetype : searchQuery}]
            });

            res.status(201).json({message : `${expenseData.length} expense found !`,expenseData});

        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc display Leave
// @route Get /api/leave
// @access hr/branch-hr
const allLeave = asyncHandler(async(req, res) => {
    
    try{

        let concernId = undefined;

        //@after giving the role then use it as concernId
        //concernId = req.account.concernId;

        let leaves;

        if(!concernId){
            //@hr
            leaves = Leave.find({ });
        }else{
            //@brach-hr
            leaves = Leave.find({ concernId });
        }

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

// @desc create Leave
// @route Post /api/leave
// @access hr/branch-hr
const createLeave = asyncHandler(async (req, res) => {
    
    try {
        
        const { concernId, departmentId, employeeId, duration, 
            leavetype, startdate, enddate, totaldays, description } = req.body;

        const leave = new Leave({
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

        await leave.save();
        res.status(200).json({ message : "Added successfully", data : leave }); 

    } catch (error) {
        res.status(400).json({ message : error.message });
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
                    allLeave, 
                    deleteLeave, 
                    searchLeave, 
                    editLeave
                };