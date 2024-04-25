const Expense = require("../models/Expense");

const { escapeString } = require("../utils/common");

//@search expense
//@private route(admin)

const searchExpense = async(req, res) => {
    try {
        const searchQuery = new RegExp(escapeString(req.params.exp),"i");

        if(req.params.exp !== ""){
            
            const expenseData = await Expense.find({
                $or : [{particulars : searchQuery},{purpose : searchQuery}]
            });

            res.status(200).json({message : `${expenseData.length} expense found !`,expenseData});

        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//@add a new expense
//@private route(admin)

const addExpense = async(req, res) => {

    try {
        const expenseData = new Expense({
            particulars : req.body.particulars,
            purpose : req.body.purpose,
            modeOfPayment : req.body.modeOfPayment,
            amount : req.body.amount,
            remarks : req.body.remarks
        });
        await expenseData.save();

        res.status(200).json({message : "Data added successfully !",expenseData});

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//@edit expense
//@private route(admin)

const editExpense = async(req, res) => {
    try {
        const expenseData = await Expense.findOne({_id : req.query.id});

        if(expenseData){
            
            const editExpense = await Expense.findByIdAndUpdate(
                {
                    _id : req.query.id
                },{
                    particulars : req.body.particulars,
                    purpose : req.body.purpose,
                    modeOfPayment : req.body.modeOfPayment,
                    amount : req.body.amount,
                    remarks : req.body.remarks
                },{
                    new : true
            });

            res.status(200).json({message : "Edited Successfully !", editExpense});
            
        }else{
            throw new Error("Data not found !");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//@add expense
//@private route(admin)

const deleteExpense = async(req, res) => {
    try {
        const expenseData = await Expense.findOne({_id : req.query.id});

        if(expenseData){
            await Expense.findByIdAndDelete({_id : req.query.id});
            res.status(200).json({message : "Deleted Successfully !"});
        }else{
            throw new Error("Data not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {  addExpense, 
                    editExpense, 
                    deleteExpense, 
                    searchExpense 
                }