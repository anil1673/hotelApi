import express from "express";
import { createHotel, deleteHotel, getAllHotel, getSingleHotel, updateHotel } from "../controller/hotel.js";
// import { verifyOwner } from "../middleware/verify.js";
import verifyOwner from "../middleware/verifyOwner.js";
// import { UploadStream } from "cloudinary";
 const hotelRouter=express.Router();
 import { upload } from "../multer.js";



// create hotel
// uploadImages is name attr of html 
hotelRouter.post("/createhotel/:ownerid",verifyOwner,upload.array('images', 5)
,createHotel);

// update hotel
hotelRouter.put("/updatehotel/:ownerid/:hotelid",verifyOwner,updateHotel);



// delete hotel
hotelRouter.delete("/deletehotel/:ownerid/:hotelid",verifyOwner,deleteHotel);

// get all hotel
hotelRouter.get("/getallhotel/:ownerid",verifyOwner,getAllHotel)

// get single hotel
hotelRouter.get("/getsinglehotel/:ownerid/:hotelid",verifyOwner,getSingleHotel)


export default hotelRouter;