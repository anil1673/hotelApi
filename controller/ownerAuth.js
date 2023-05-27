import Owner from "../models/owner.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { transporter } from "../email/emailConfig.js";


// register user

export const register=async(req,res,next)=>{
    try{
        const hashPass=await bcrypt.hash(req.body.password,10);
        const {ownername,email,password}=req.body;
        
        const isEmailUnique=await Owner.findOne({email});
        if(!isEmailUnique){
            const newOwner=new Owner({ownername,email,password:hashPass});
            await newOwner.save().then((owner)=>{
                res.status(200).json({
                    owner:owner
                })
            }).catch((error)=>{
                res.status(200).json({
                    error:error,
                })
            })
            
        }else{
            res.status(403).json({
                error:"email already available"
            })
        }
          
    }catch(err){
        next(err)
    }
}


// user login

export const login=async(req,res,next)=>{
    try{
        const {email,password}=req.body;

        const isEmailAvailable=await Owner.findOne({email}).then(async(owner)=>{
             bcrypt.compare(password,owner.password,(err,result)=>{
                if(result){
                    // generate token
                    jwt.sign({_id:owner._id},process.env.SECRET_KEY,(err,token)=>{
                        if(err)res.status(400).json({error:err});
                        res.cookie("access_token", token, {
                            httpOnly: true,
                          }).status(200).json({
                            owner:owner,
                            access_token:token,
                        })
                    })
                    
                }else{
                    res.status(400).json({error:"wrong password"});
                }
            })

        }).catch((error)=>{
            res.status(401).json({
                error:"email not found",
            })
        })

    }catch(error){
        next(error)
    }
}


export const generateOtp=async(req,res,next)=>{
    const {email}=req.body;
    await Owner.findOne({email}).then(async(owner)=>{
        if(owner){
            req.app.locals.OTP=await otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
            await transporter.sendMail({
                            from:process.env.EMAIL_FROM,
                            to:email,
                            subject:"Change Password",
                            html:`<h3>Password Change OTP is <h2> ${req.app.locals.OTP} </h2> </h3>`
                        }).then(()=>{
                            res.status(200).json({
                                otp:req.app.locals.OTP
                            })
                            
                        }).catch((error)=>{
                            res.status(404).json("invalid email")
                        })
        }else{
            res.status(404).json("email not available")
        }
    }) 
}

// verify OTP
// this work when user type otp and click verify Otp button
export const verifyOtp=async(req,res,next)=>{
    try{
        const {otp}=req.body;
        if(parseInt(req.app.locals.OTP) === parseInt(otp)){
            // entered otp matched
            req.app.locals.OTP=null;
            req.app.locals.resetSession=true;
            res.status(200).json({
                message:"otp verification success"+req.app.locals.resetSession
            })
            

        }else{
            // entered OTP is invalid
            res.status(400).json({
                error:"Invalid Otp"
            })
        }
    }catch(error){
        next(error);
    }
}


// save new password

export const savePassword=async(req,res,next)=>{
    try{
        if(req.app.locals.resetSession){
            const {email}=req.body;
            
            const {password,confirmPassword}=req.body;
            await Owner.findOne({email}).then(async(owner)=>{
                console.log(password , confirmPassword)
                if(password === confirmPassword){
                    const hashPass=await bcrypt.hash(password,10);
                    await Owner.findByIdAndUpdate(owner._id,{$set:{password:hashPass}},{new:true}).then(owner=>{
                        req.app.locals.resetSession=false;
                        res.status(200).json({
                            message:"password changed successfully",
                            owner:owner
                        });
                    }).catch(error=>{
                        res.status(200).json({
                            error:error
                        })
                    })
                }else{
                    res.status(400).json({
                        error:"password mismatch"
                    })
                }
            }).catch((error)=>{
                res.status(400).json({
                    error:"email not found",
                    message:error
                })
            })
        }else{
            res.status(401).json({
                error:"reset session is still false"
            })
        }
        
    
    }catch(error){
        next(error)
    }
}