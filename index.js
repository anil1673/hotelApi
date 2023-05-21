import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({path:"./config.env"});
import mongoose from "mongoose";
import "./db/conn.js"
import userAuthRouter from "./routes/userAuth.js";
import ownerAuthRouter from "./routes/ownerAuth.js";
import hotelRouter from "./routes/hotel.js";
import ownerRoomRouter from "./routes/ownerRoom.js";
import userRouter from "./routes/user.js";





const app=express();

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes set
app.use("/userauth",userAuthRouter);
app.use("/ownerauth",ownerAuthRouter);
app.use("/hotel",hotelRouter);
app.use("/ownerroom",ownerRoomRouter);
app.use("/user",userRouter);




// custom error management
app.use((err,req,res,next)=>{
    const errStatus=err.sataus || 500;
    const errMsg=err.message || "something went wrong";
    return res.status(errStatus).json({
        success:false,
        status:errStatus,
        message:errMsg,
        stack:err.stack,


    })
})



// express setup
app.listen(process.env.PT,(req,res)=>{
    console.log("express connection successfull");
})
