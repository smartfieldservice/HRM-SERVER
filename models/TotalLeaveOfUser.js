const { mongoose, Schema} = require("mongoose");

const TotalLeaveOfUserSchema = mongoose.Schema(
    {
        employeeId: {
            type: Schema.ObjectId,
            ref : "user",
            required: true 
        },
        totalSick : {
            type : Number,
            default : 0
        },
        totalCasual : {
            type : Number,
            default : 0
        }
    },{
        toJSON : {
            transform : function(doc, ret){
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
            }
        },
        timestamps : true
});

//@exports
module.exports = mongoose.model("total-leave-of-user", TotalLeaveOfUserSchema);