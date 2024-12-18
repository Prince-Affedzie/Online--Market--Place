const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next)=>{
    try{
        const accessToken = req.cookies.accessToken
       
        if(!accessToken){
            return res.status(401).json('No token Provided')
        }
        const decoded = jwt.verify(accessToken,process.env.JWT_ACCESS_TOKEN)
        req.user = decoded
        //res.status(200).json({ user: decoded });
        next()
    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}
const isSeller = (req,res,next)=>{
    try{
        console.log(req.user)
    if(req.user && req.user.role ==="Seller"){
       return next()
    }
    else{
        console.log("Unauthorized Access")
        res.status(401).json("Unauthorized Access")
    }
}catch(err){
    console.log(err)
    res.status(500).json("Internal Server Error")
}
}

const Auth = (req,res,next)=>{
    try{
        const accessToken = req.cookies.accessToken
        if(!accessToken){
            return res.status(401).json('No token Provided')
        }
        const decoded = jwt.verify(accessToken,process.env.JWT_ACCESS_TOKEN)
        req.user = decoded
        res.status(200).json({ user: decoded });
       
    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

module.exports = {verifyToken,isSeller,Auth}