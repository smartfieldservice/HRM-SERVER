const { mongoose, Schema } = require("mongoose");

const departmentSchema = new mongoose.Schema(
    {
        concernId : {
            type : Schema.ObjectId,
            ref : "concern",
            required : true
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        slug : {
            type : String
        }
    }
);

//@exports
module.exports = mongoose.model("department", departmentSchema);