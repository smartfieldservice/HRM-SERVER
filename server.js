const express = require('express');
const path = require("path");
const cors = require("cors");
const dotenv = require('dotenv');
const logger = require('morgan');
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");

dotenv.config({ path: path.resolve(__dirname, './.env') });
connectDB();

const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }))

if(process.env.NODE_ENV === "development"){
  app.use(logger("dev"));
}

//@User Routes
app.use("/api/users", userRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/department", departmentRoutes);


const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}!`));