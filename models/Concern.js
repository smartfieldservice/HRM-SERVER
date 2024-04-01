const mongoose = require("mongoose");

const concernSchema = mongoose.Schema({
    
    name : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    logo : {
        type : String
    },
    description : {
        type : String
    },
    slug : {
        type : String,
        unique : true
    }
},{ 
    timestamps : true 
});

//@exports
module.exports = mongoose.model("concern",concernSchema);