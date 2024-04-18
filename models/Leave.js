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
            type: String,
            enum : ['half_day', 'full_day'],
            default : 'full_day'
        },
        leavetype: {
            type: String,
            enum : ['sick', 'casual','other'],
            default : 'casual'
        },
        startdate: {
            type: String,
            required: true
        },
        enddate: {
            type: String,
            required: true
        },
        totaldays: {
            type: Number,
            default : 0
        },
        description: {
            type: String
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
