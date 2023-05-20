import dotenv from "dotenv"
dotenv.config({path:"./config.env"});
import mongoose from "mongoose";




mongoose.connect(process.env.DATABASE,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("mongoose connection success")
}).catch((error)=>{
    console.log("mongoose connection problem ",error )
})