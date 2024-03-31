//@external module
const mongoose = require("mongoose");

//@create schema
const documentSchema = mongoose.Schema({
    
        title : {
            type : String,
            unique : true,
            required : true
        },
        fileName : {
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
        timestamps : true
});

//@exports
module.exports = mongoose.model("document",documentSchema);