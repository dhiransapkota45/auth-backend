const express = require("express")
const app = express()
const router = require("./routes/user_route")
const connectDB = require("./database/db")
const cors = require("cors")
connectDB()

app.use(cors())
app.use(express.json())
app.use("/api", router)


app.listen(5000, ()=>console.log("server listening at 5000 port"))