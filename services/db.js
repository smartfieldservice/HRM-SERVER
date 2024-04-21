//external module
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

//database configuration
module.exports = async()=>{
    mongoose.connect(process.env.MONGO_URI,{})
    .then(() => console.log("Database connection established!"))
    .catch((error) => console.log("Database connection not established!"))
}