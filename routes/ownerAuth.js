import express from "express";
import { generateOtp, login, register, savePassword, verifyOtp } from "../controller/ownerAuth.js";
import { localVariables } from "../middleware/verifyUser.js";
const ownerAuthRouter=express.Router();


// register
ownerAuthRouter.post("/register1",register);
// login
ownerAuthRouter.post("/login1",login);
// generate otp
ownerAuthRouter.get("/generateotp1",localVariables,generateOtp);
// verify otp
ownerAuthRouter.get("/verifyotp1",verifyOtp);
// save passoword 
ownerAuthRouter.post("/savepassword1",savePassword);



export default ownerAuthRouter;