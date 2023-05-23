import express from "express";
import { createRoom, deleteRoom, updateRoom ,getAllRoom, updloadRoomPic} from "../controller/ownerRoom.js";
import verifyOwner from "../middleware/verifyOwner.js";
import { upload } from "../photosLink.js";

const ownerRoomRouter=express.Router();

// create room
ownerRoomRouter.post("/createroom/:ownerid/:hotelid",verifyOwner,createRoom);
// ownerRoomRouter.post("/createroom/:ownerid/:hotelid",verifyOwner,createRoom);


// upload room pic
ownerRoomRouter.post("/uploadroompic/:ownerid/:hotelid/:roomid",verifyOwner,upload.single("photos"),updloadRoomPic);

// update room
ownerRoomRouter.put("/updateroom/:ownerid/:hotelid/:roomid",verifyOwner,updateRoom);

// delete room
ownerRoomRouter.delete("/deleteroom/:ownerid/:hotelid/:roomid",verifyOwner,deleteRoom);

// get all room of certain hotel
ownerRoomRouter.get("/getallroom/:ownerid/:hotelid/",verifyOwner,getAllRoom);







export default ownerRoomRouter;
