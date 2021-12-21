const mongoose = require("mongoose")
const dbURI = `mongodb://localhost:27017/authentication`

const connectDB = async()=>{
    await mongoose.connect(dbURI)
    await console.log("connection successful");
}
module.exports = connectDB