const jwt= require('jsonwebtoken')

function authenticateTOken(req,res,next){
    const authHeaders=req.headers['authorization']
    const token=authHeaders && authHeaders.split(' ')[1]
    if(token===null){
        return res.status(401).json({ success: false, message: 'Unauthorized - Please log in to access this resource' });

    }

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if (err) {
            return res.status(403).json({ success: false, message: 'Forbidden - Invalid token' });
        }
        req.user = user;
        next();
    })
}
module.exports=authenticateTOken