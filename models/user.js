const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const User_Model = new mongoose.model("user_model", schema)
module.exports = User_Model