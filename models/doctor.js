const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            maxlength:50,
            trim:true
        },
        number:{
            type:String,
            required:true,
            maxlength:15,
             trim:true
        },
        email:{
            type:String,
             trim:true,
             default:"",

        },
        preferdDate:{
            type:Date,
            required:true,

        },
        preferdTime:{
            type:String,
            required:true,
        },
        message:{
            type:String,
            trim:true,
            default:"",
        }
     },
     {
        timestamps:true,
     }
);



module.exports = mongoose.model("Appointment",doctorSchema);