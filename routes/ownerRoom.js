import express from "express";
import { createRoom, deleteRoom, updateRoom ,getAllRoom} from "../controller/ownerRoom.js";
import verifyOwner from "../middleware/verifyOwner.js";

const ownerRoomRouter=express.Router();

// create room
ownerRoomRouter.post("/createroom/:ownerid/:hotelid",verifyOwner,createRoom);

// update room
ownerRoomRouter.put("/updateroom/:ownerid/:hotelid/:roomid",verifyOwner,updateRoom);

// delete room
ownerRoomRouter.delete("/deleteroom/:ownerid/:hotelid/:roomid",verifyOwner,deleteRoom);

// get all room of certain hotel
ownerRoomRouter.get("/getallroom/:ownerid/:hotelid/",verifyOwner,getAllRoom);







export default ownerRoomRouter;
