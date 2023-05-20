import User from "../models/user.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { transporter } from "../email/emailConfig.js";


// register user
export const register=async(req,res,next)=>{
    try{
        const hashPass=await bcrypt.hash(req.body.password,10);
        const {username,email,phone,password,isOwner}=req.body;
        
        const isEmailUnique=await User.findOne({email});
        if(!isEmailUnique){
            const newUser=new User({username,email,phone,isOwner,password:hashPass});
            await newUser.save().then((user)=>{
                res.status(200).json({
                    message:"user registration success",
                    user:user
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

        const isEmailAvailable=await User.findOne({email}).then(async(user)=>{
             bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    // generate token
                    jwt.sign({_id:user._id},process.env.SECRET_KEY,(err,token)=>{
                        if(err)res.status(400).json({error:err});
                        res.status(200).json({
                            message:"login success",
                            token:"Bearer " + token
                        })
                    })
                    
                }else{
                    res.status(400).json({error:"wrong password"})
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


// generate OTP
// export const generateOtp=async(req,res,next)=>{
//    try{
//     //     const {email}=req.query;
//     // await User.findOne({email}).then(async(user)=>{
//     //     console.log("11111")
        
//     //     req.app.locals.OTP=await otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
//     //     console.log("222222")
//     //     await transporter.sendMail({
//     //         from:process.env.EMAIL_FROM,
//     //         to:email,
//     //         subject:"Change Password",
//     //         html:`<h3>Password Change OTP is <h2> ${req.app.locals.OTP} </h2> </h3>`
//     //       }).then(()=>{
            
//     //       }).catch(()=>{

//     //       });
//     //       console.log("3333")
//     //       res.status(200).json({code:req.app.locals.OTP});
//     // }).catch((error)=>{
//     //     res.status(404).json({
//     //         error:"email not available",
//     //         msg:error
//     //     })
//     // })



// }catch(error){
//     next(error)
// }
// }



export const generateOtp=async(req,res,next)=>{
    
    const {email}=req.query;
    req.app.locals.OTP=await otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});

    // console.log(req.app.locals.OTP)
    await User.find({email}).then(async(user)=>{
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
            await User.findOne({email}).then(async(user)=>{
                console.log(password , confirmPassword)
                console.log("1111");
                if(password === confirmPassword){
                    const hashPass=await bcrypt.hash(password,10);
                    console.log("2222")
                    await User.findByIdAndUpdate(user._id,{$set:{password:hashPass}},{new:true}).then(user=>{
                        console.log("33333")
                        req.app.locals.resetSession=false;
                        res.status(200).json({
                            message:"password changed successfully"
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