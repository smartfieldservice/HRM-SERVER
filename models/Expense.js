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
},{timestamps : true});

module.exports = mongoose.model("Expense",expenseSchame);