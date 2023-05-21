import { verifyUser } from "../middleware/verifyUser.js";
import express from "express";
import { addReview, getAllReview } from "../controller/user.js";
const userRouter=express.Router();

// add review
userRouter.post("/addreview/:userid/:hotelid",verifyUser,addReview);

// getAll review
userRouter.get("/getallreview/:userid/:hotelid",verifyUser,getAllReview);








export default userRouter;