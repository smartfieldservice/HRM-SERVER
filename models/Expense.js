const mongoose = require("mongoose");

const expenseSchame = mongoose.Schema({
    particulars : {
        type : String,
        required : true,
    },
    purpose : {
        type : String,
        required : true,
    },
    modeOfPayment : {
        type : String,
        required : true,
    },
    amount : {
        type : Number,
        required : true,
    },
    remarks : {
        type : String,
        required : true,
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
module.exports = mongoose.model("Expense",expenseSchame);