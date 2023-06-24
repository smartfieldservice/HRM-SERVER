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
        leavetype: {
            type: String,
            required: true
        },
        totaldays: {
            type: String
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
        }
    },
    {
        timestamps: true,
    }
);
