const jwt =require("jsonwebtoken")
const config = require("config")

module.exports =function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {    
        return res.status(401).send('Not authenticated.No token provided');
    }
    

    try{
        decoded = jwt.verify(token,config.get("vidly_jwtPrivateKey"))
        req.user = decoded
    }
    catch(err){
        return res.status(400).send("Invalid token");
    }
    next();
}