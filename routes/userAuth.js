import express from "express";
import { generateOtp, login, register, savePassword, verifyOtp } from "../controller/userAuth.js";
import { localVariables } from "../middleware/verifyUser.js";
const userAuthRouter=express.Router();


// register
userAuthRouter.post("/register2",register);
// login
userAuthRouter.post("/login2",login);
// generate otp
userAuthRouter.get("/generateotp2",localVariables,generateOtp);
// verify otp
userAuthRouter.get("/verifyotp2",verifyOtp);
// save passoword 
userAuthRouter.post("/savepassword2",savePassword);



export default userAuthRouter;