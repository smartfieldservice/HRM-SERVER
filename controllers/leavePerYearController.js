//@external module
const asyncHandler = require('express-async-handler');
const { isValidObjectId } = require('mongoose');

//@internal module
const { LeavePerYear } = require('../models/modelExporter');
const { pagination } = require('../utils/common');

// @desc display Leave-per-year
// @route get /api/leave-per-year
// @access hr
const allLeavePerYear = asyncHandler(async(req, res) => {

    try {

        const { page, limit, sort} = req.query;

        let leavePerYear = LeavePerYear.find({ });

        let sortBy = "-createdAt";
        if(sort){
            sortBy = sort.replace(","," ");
        }

        leavePerYear = leavePerYear.sort(sortBy);

        leavePerYear = await pagination(page, limit, leavePerYear);

        res.status(200).json({ message : `${leavePerYear.length} data found !`, data : leavePerYear })

    } catch (error) {
        res.status(400).json({ message : error.message });
    }

});

// @desc create Leave-per-year
// @route Post /api/leave-per-year
// @access hr
const createLeavePerYear = asyncHandler(async(req, res) => {

    try {
        
        const { year, casual, sick, other } = req.body;

        const leavePerYear = new LeavePerYear({
            year,
            casual,
            sick,
            other
        });

        await leavePerYear.save();
        res.status(200).json({message : "Leave per year added successfully !", leavePerYear });

    } catch (error) {
        res.status(400).json({ message : error.message });
    }
});

// @desc update Leave-per-year
// @route Delete /api/leave-per-year
// @access hr
const deleteLeavePerYear = asyncHandler(async(req, res) => {

    try {

        if(!isValidObjectId(req.query.id)){

            res.status(409).json({ message : "Invalid Id" });
            
        }
        else{
            let leavePerYear = await LeavePerYear.findById({ _id : req.query.id });

            if(!leavePerYear){

                res.status(404).json({ message : "Not found" });
            
            }else{

                await LeavePerYear.findByIdAndDelete({ _id : req.query.id });

                res.status(200).json({ message : "Deleted successfully" });
            }
        }
    } catch (error) {
        res.status(400).json({ message : error.message });
    }
});

//@exports
module.exports = {  allLeavePerYear,
                    createLeavePerYear,
                    deleteLeavePerYear
                }