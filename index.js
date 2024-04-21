//@external module
const express = require('express');
const { App, Db } = require("./services/serviceExporter"); 

const app = express();

const startServer = async() => {
  
    await Db();
    await App(app);

    app.listen(process.env.PORT,() => {
        console.log(`App listening in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`);
    });
}

//@start the server
startServer();