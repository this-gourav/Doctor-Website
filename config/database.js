const mongoose = require("mongoose");


require("dotenv").config();

const dbconnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL,{
    })
    .then(()=>console.log("Db connected"))
    .catch((error)=>{
        console.log("Issue with database");
        console.error(error.message);
        
    });
}


module.exports  = dbconnect;