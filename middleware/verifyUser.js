import jwt from "jsonwebtoken";

export const verifyUser=async(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        if(token){
            // token available
            jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
                if(err){
                    res.status(400).json({
                        error:err,
                        message:"authorization problem",
                        isLoggedIn:false,
                    })

                }else{
                    
                    if(req.params.userid === user._id){
                        // everything alright
                        req.user=user;
                        next();
                    }else{
                        res.status(400).json({
                            error:err,
                            message:"authorization problem",
                            isLoggedIn:false,
                        })
                    }
                    
                }
            })
            

        }else{
            // token not available
            res.status(404).json({
                // if token is not present or authentication problem
                error:"authentication problem"
            })
        }

    }catch(error){
        next(error)
    }
}


// localevariables

export const localVariables=(req,res,next)=>{
    req.app.locals={
        OTP:null,
        resetSession:false,
    }
    next();
}