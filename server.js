//@external module
const express = require('express');
const path = require("path");
const cors = require("cors");
const dotenv = require('dotenv');
const logger = require('morgan');

//@internal module
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const adminRoutes = require("./routes/adminRoute");
const documentRoutes = require("./routes/documentRoute");
const concernRoute = require("./routes/concernRoute");

dotenv.config({ path: path.resolve(__dirname, './.env') });
connectDB();

const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));

if(process.env.NODE_ENV === "development"){
  app.use(logger("dev"));
}

//@User Routes
app
  .use("/api/users", userRoutes)
  .use("/api/employee", employeeRoutes)
  .use("/api/department", departmentRoutes)
  .use("/api/leave", leaveRoutes)
  .use("/api/expense", expenseRoutes)
  .use("/api/document", documentRoutes)
  .use("/api/concern", concernRoute)

app.listen(process.env.PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}!`));