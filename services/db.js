//@external module
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

//@database configuration
module.exports = async()=>{
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(`Database connection established to ${process.env.MONGO_URI}`))
    .catch((error) => console.log(`Database not connected due to -> ${error}`))
}