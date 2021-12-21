const jwt = require("jsonwebtoken")
const JWT_SECRET = "mynameisdhiransapkota";

const fetchuser = (req, res, next) => {
    const token = req.header("authToken")
    if(!token){
        res.status(400).json({msg:"Couldnot find token" , success:false})
    }
    const payload_data = jwt.verify(token, JWT_SECRET)
    // console.log(payload_data);
    req.id = payload_data.id
    // console.log(req.id);
    next()
}

module.exports = fetchuser