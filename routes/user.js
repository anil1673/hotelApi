import { verifyUser } from "../middleware/verifyUser.js";
import express from "express";
import { addReview, booking, getAllReview, updateProfilepic,cancelBooking,getAllBooking, getAllHotel } from "../controller/user.js";
const userRouter=express.Router();
import { upload } from "../photosLink.js";

// get All Hotel
userRouter.get("/getallhotel",verifyUser,getAllHotel);

// update profile pic
userRouter.post("/updateprofilepic/:userid/",verifyUser,upload.single("photos"),updateProfilepic);
// add review
userRouter.post("/addreview/:userid/:hotelid",verifyUser,addReview);

// getAll review
userRouter.get("/getallreview/:userid/:hotelid",verifyUser,getAllReview);

// book room
userRouter.post("/bookroom/:userid/:hotelid/:roomid",verifyUser,booking);

// cancel booking 
userRouter.post("/cancelbooking/:userid/:hotelid/:roomid/:bookingid",verifyUser,cancelBooking);


// get all booking
userRouter.get("/getallbooking/:userid",verifyUser,getAllBooking)










export default userRouter;