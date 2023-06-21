const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
    {
        departmentName: {
            type: String,
            required: true,
        },
        Description: {
            type: String,
        }
    }
);

const User = mongoose.model("Department", departmentSchema);
module.exports = User;