const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
        
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true
    }
},{
    timestamps : true
});

//@exports
module.exports = mongoose.model("admin",adminSchema);