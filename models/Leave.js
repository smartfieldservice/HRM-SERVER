const { string } = require("joi");
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
            required: true,
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
        },
        slug : {
            type : String
        }
    },
    {
        toJSON : {
            transform : function(doc, ret){
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
            }
        },
        timestamps: true,
    }
);

//@exports
module.exports= mongoose.model("Leave", leaveSchema);
