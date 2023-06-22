const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
    {
        employeename: {
            type: String,
            required: true
        },
        duration: {
            type: String,
        },
        startdate: {
            type: String,
            required: true
        },
        enddate: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        status: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const Leaves = mongoose.model("LeaveDetails", leaveSchema);
module.exports = Leaves;