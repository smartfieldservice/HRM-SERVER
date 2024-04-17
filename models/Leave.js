const { mongoose,Schema } = require("mongoose");

const leaveSchema = new mongoose.Schema(
    {
        concernId : {
            type : Schema.ObjectId,
            ref : "concern",
            default : null
        },
        departmentId : {
            type : Schema.ObjectId,
            ref : "department",
            default : null
        },
        employeeId: {
            type: String,
            ref : "user",
            required: true 
        },
        duration: {
            type: Number,
        },
        leavetype: {
            type: String,
            required: true,
        },
        totaldays: {
            type: Number
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
