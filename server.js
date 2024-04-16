//@external module
const express = require('express');
const path = require("path");
const cors = require("cors");
const dotenv = require('dotenv');
const logger = require('morgan');

//@internal module
const connectDB = require("./config/db");
const { userRoute,
        concernRoute,
        departmentRoute,
        leaveRoute,
        expenseRoute,
        documentRoute } = require("./routes/routeExporter");

dotenv.config({ path: path.resolve(__dirname, './.env') });
connectDB();

const app = express();
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
  .use("/api/expense", expenseRoute)
  
app.listen(process.env.PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}!`));