import { verifyUser } from "../middleware/verifyUser.js";
import express from "express";
import { addReview, booking, getAllReview, updateProfile,cancelBooking,getAllBooking, getAllHotel, updloadProfilePicToClodinary, getSingleHotel, automaticUnBook, getSingleHotelNoAuth } from "../controller/user.js";
const userRouter=express.Router();
import { upload } from "../photosLink.js";

// get All Hotel
userRouter.get("/getallhotel/:userid",verifyUser,getAllHotel);

// update profile pic to cloudinary
userRouter.post("uploadprofilepictocloud",updloadProfilePicToClodinary)

// update profile pic
userRouter.post("/updateprofil/:userid",verifyUser,updateProfile);

// get single hotel
userRouter.get("/getsinglehotel/:userid/:hotelid",verifyUser,getSingleHotel);

// / get single hotel no auth
userRouter.get("/getsinglehotel/:ownerid/:hotelid",getSingleHotelNoAuth);

// add review
userRouter.post("/addreview/:userid/:hotelid",verifyUser,addReview);

// getAll review
userRouter.get("/getallreview/:userid/:hotelid",verifyUser,getAllReview);

// book room
userRouter.post("/bookroom/:userid/:hotelid/:roomid",verifyUser,booking);

// cancel booking 
userRouter.post("/cancelbooking/:userid/:hotelid/:roomid/:bookingid",verifyUser,cancelBooking);

// automatic unbooking room
userRouter.put("/automatiunbook",automaticUnBook)


// get all booking
userRouter.get("/getallbooking/:userid",verifyUser,getAllBooking)











export default userRouter;