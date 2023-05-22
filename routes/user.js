import { verifyUser } from "../middleware/verifyUser.js";
import express from "express";
import { addReview, getAllReview, updateProfilepic } from "../controller/user.js";
const userRouter=express.Router();
import { upload } from "../photosLink.js";

// 
userRouter.post("/updateprofilepic/:userid/",verifyUser,upload.single("photos"),updateProfilepic);
// add review
userRouter.post("/addreview/:userid/:hotelid",verifyUser,addReview);

// getAll review
userRouter.get("/getallreview/:userid/:hotelid",verifyUser,getAllReview);









export default userRouter;