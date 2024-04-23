//@external module
const express = require('express');
const path = require("path");
const cors = require("cors");
const dotenv = require('dotenv');
const logger = require('morgan');

//@internal module
const { userRoute,
        concernRoute,
        departmentRoute,
        leaveRoute,
        leavePerYearRoute,
        expenseRoute,
        documentRoute,
        dashboardRoute } = require("../routes/routeExporter");

dotenv.config({ path: path.resolve(__dirname, './.env') });

module.exports = async(app) => {

    app
        .use(cors())
        .use(express.json({limit: '50mb'}))
        .use(express.urlencoded({ extended: false }));

    if(process.env.NODE_ENV === "development"){
        app.use(logger("dev"));
    }

    app
        .use("/api/users", userRoute)
        .use("/api/concern", concernRoute)
        .use("/api/department", departmentRoute)
        .use("/api/document", documentRoute)
        .use("/api/leave", leaveRoute)
        .use("/api/leave-per-year", leavePerYearRoute)
        .use("/api/expense", expenseRoute)
        .use("/api/dashboard", dashboardRoute)

}
