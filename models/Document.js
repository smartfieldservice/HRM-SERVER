//@external module
const mongoose = require("mongoose");

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
        owner : {
            type : String,
            required : true
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