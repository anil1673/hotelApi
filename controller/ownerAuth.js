import Owner from "../models/owner.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { transporter } from "../email/emailConfig.js";


// register user

export const register=async(req,res,next)=>{
    try{
        const hashPass=await bcrypt.hash(req.body.password,10);
        const {ownername,email,phone,password,isOwner}=req.body;
        
        const isEmailUnique=await Owner.findOne({email});
        if(!isEmailUnique){
            const newOwner=new Owner({ownername,email,phone,isOwner,password:hashPass});
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
                            owner:owner
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
    
    const {email}=req.query;
    req.app.locals.OTP=await otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});

    // console.log(req.app.locals.OTP)
    await Owner.find({email}).then(async(owner)=>{
        await transporter.sendMail({
            from:process.env.EMAIL_FROM,
            to:email,
            subject:"Change Password",
            html:`<h3>Password Change OTP is <h2> ${req.app.locals.OTP} </h2> </h3>`
        }).then(()=>{
            
        }).catch((error)=>{
            console.log(error)
        })
    })
    res.status(200).json({
        code:req.app.locals.OTP
    })

  
}

// verify OTP
// this work when user type otp and click verify Otp button
export const verifyOtp=async(req,res,next)=>{
    try{
        const {otp}=req.query;
        if(parseInt(req.app.locals.OTP) === parseInt(otp)){
            // entered otp matched
            console.log("1111")
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
            const {email}=req.query;
            
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