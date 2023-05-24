import express from "express";
import { createRoom, deleteRoom, updateRoom ,getAllRoom, updloadRoomPicToClodinary,uploadRoomPicToRoom} from "../controller/ownerRoom.js";
import verifyOwner from "../middleware/verifyOwner.js";
import { upload } from "../photosLink.js";

const ownerRoomRouter=express.Router();

// create room
ownerRoomRouter.post("/createroom/:ownerid/:hotelid",verifyOwner,createRoom);
// ownerRoomRouter.post("/createroom/:ownerid/:hotelid",verifyOwner,createRoom);


// upload room pic to cludinary
ownerRoomRouter.post("/uploadroompictocloud",upload.single("photos"),updloadRoomPicToClodinary);

// upload room pic to room
// ownerRoomRouter.post("/uploadroompictoroom/:ownerid/:hotelid/:roomid",verifyOwner,uploadRoomPicToRoom);

// upload room pic to room


// update room
ownerRoomRouter.put("/updateroom/:ownerid/:hotelid/:roomid",verifyOwner,updateRoom);

// delete room
ownerRoomRouter.delete("/deleteroom/:ownerid/:hotelid/:roomid",verifyOwner,deleteRoom);

// get all room of certain hotel
ownerRoomRouter.get("/getallroom/:ownerid/:hotelid/",verifyOwner,getAllRoom);







export default ownerRoomRouter;
