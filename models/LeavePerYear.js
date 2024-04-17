const mongoose = require("mongoose");

const leavePerYearSchema = mongoose.Schema({
    
    year : {
        type : String,
        required :true
    },
    casual : {
        type : Number,
        default : 0
    },
    sick : {
        type : Number,
        default : 0
    },
    other : {
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
module.exports = mongoose.model("leave-per-year", leavePerYearSchema);