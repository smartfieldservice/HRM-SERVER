//@external module
const { mongoose, Schema } = require("mongoose");

//@create schema
const documentSchema = mongoose.Schema({
    
        title : {
            type : String,
            unique : true,
            required : true
        },
        filesName : {
            type : Array,
            required : true
        },
        description : {
            type : String,
            required : true
        },
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
        slug : {
            type : String,
            unique : true
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
module.exports = mongoose.model("document",documentSchema);