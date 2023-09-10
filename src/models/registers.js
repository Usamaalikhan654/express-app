const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    userRole: {  // Updated field name to "userRole"
        type: String,  // Changed the type to String
        required: true
      },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmpassword:{
        type:String,
        required:true,
    },
})

const Register = new mongoose.model("Register" , userSchema);

module.exports= Register;