import Hotel from "../models/hotel.js";
import Room from "../models/room.js";

// create Room
export const createRoom=async(req,res,next)=>{
    try{
        if(req.body.number === "" || req.body.type==="" || req.body.price===""){
            res.status(200).json("number , type and price can't be empty");
        }else{
            const newRoom=new Room(req.body);
        await newRoom.save().then(async(room)=>{
            await Hotel.findByIdAndUpdate(req.params.hotelid,{$push:{rooms:room._id}},{new:true}).then((hotel)=>{
                res.status(200).json(hotel)
            }).catch((error)=>{
                next(error)
            })
        })
        }
        
    }catch(error){
        next(error);
    }
}


// update room
export const updateRoom=async(req,res,next)=>{
    try{
        await Room.findByIdAndUpdate(req.params.roomid,{$set:req.body},{new:true}).then((room)=>{
            res.status(200).json(room);
        }).catch((error)=>{
            next(error)
        })
    }catch(error){
        next(error)
    }
}


// delete room 
export const deleteRoom=async(req,res,next)=>{
    try{
        await Hotel.findByIdAndUpdate(req.params.hotelid,{$pull:{rooms:req.params.roomid}},{new:true}).then(async()=>{
            await Room.findByIdAndDelete(req.params.roomid).then(()=>{
                res.status(200).json("room deleted successfully....")
            }).catch((error)=>{
                next(error)
            })
        })
        
    }catch(error){
        next(error)
    }
}

// get all room of certain hotel
export const getAllRoom=async(req,res,next)=>{
    try{
        const hotel=await Hotel.findById(req.params.hotelid).then(async(hotel)=>{
            const roomIds=hotel.rooms;
            Room.find({ _id: { $in: roomIds } })
            .then(rooms => {
            res.status(200).json(rooms)
            })
            .catch(error => {
            next(error)
            });
        })
    }catch(error){
        next(error);
    }
}