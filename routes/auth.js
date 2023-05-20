import express from "express";
import { generateOtp, login, register, savePassword, verifyOtp } from "../controller/auth.js";
import { localVariables } from "../middleware/verifyUser.js";
const authRouter=express.Router();


// register
authRouter.post("/register",register);
// login
authRouter.post("/login",login);
// generate otp
authRouter.get("/generateotp",localVariables,generateOtp);
// verify otp
authRouter.get("/verifyotp",verifyOtp);
// save passoword 
authRouter.post("/savepassword",savePassword);



export default authRouter;