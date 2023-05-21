import jwt from "jsonwebtoken";

 const verifyOwner=async(req,res,next)=>{
    try{
        // const token=req.headers.bearer;
        const token=req.headers.authorization.split(" ")[1];
        jwt.verify(token,process.env.SECRET_KEY,(err,owner)=>{
           if(token) {
            
            if(err){
                res.status(400).json({
                    error:err,
                    message:"authorization problem",
                    isLoggedIn:false,
                })

            }else{
                if(req.params.ownerid === owner._id){
                    req.owner=owner;
                    next();
                }else{
                    res.status(400).json({
                        error:err,
                        message:"authorization problem",
                        isLoggedIn:false,
                    })
                }
            }
        }else{
                // token not available
            res.status(404).json({
                // if token is not present or authentication problem
                error:"authentication problem"
            })
        }
        })

    }catch(error){
        next(error);
    }
    
}

export default verifyOwner;
