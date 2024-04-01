const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
        },
        mobile: {
            type: String,
            required: true
        },
        emargencyMobile : {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            required: true
        },
        presentaddress: {
            type: String,
            required: true,
        },
        permanentaddress: {
            type: String,
        },
        city: {
            type: String,
        },
        country: {
            type: String
        },
        imagePath: {
            type: String,
            requried: [true, 'Please Add Employee Image']
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("EmployeeDetails", employeeSchema);