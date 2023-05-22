import Hotel from "../models/hotel.js";
import Room from "../models/room.js";

// create Room
export const createRoom=async(req,res,next)=>{
    try{
        console.log(req.body)
        if(req.body.number === "" || req.body.type==="" || req.body.price===""){
            res.status(200).json("number , type and price can't be empty");
        }else{

            
// 
            const newRoom=await new Room({...req.body,hotel:req.params.hotelid,owner:req.params.ownerid})
            await newRoom.save().then(async(newroom)=>{
                await Hotel.findByIdAndUpdate(req.params.hotelid,{$push:{rooms:newroom._id}},{new:true}).then(async(hotel)=>{
                    const updatedHotel=await Hotel.findById(hotel._id).populate("owner").populate("rooms").populate({
                        path:"review",populate:{path:"user"}}).populate("rooms");
                    const allHotel=await Hotel.find({owner:req.params.ownerid}).populate({ path:"review",populate:{path:"user"} }).populate("rooms").populate("owner");
                    res.status(200).json({updatedHotel,allHotel,newRoom});

                

        

           
                
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
        await Room.findByIdAndUpdate(req.params.roomid,{$set:req.body},{new:true}).then(async(updatedRoom)=>{
            // fetch hotel complete detail
            const hotel=await Hotel.findById(req.params.hotelid).populate({
                path:"review",populate:{path:"user"}
              }).populate("rooms");
            const allHotel=await Hotel.find({owner:req.params.ownerid}).populate({ path:"review",populate:{path:"user"} }).populate("rooms").populate("owner")  
              res.status(200).json({hotel,updatedRoom,allHotel});

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
            await Room.findByIdAndDelete(req.params.roomid).then(async()=>{
            // fetch hotel complete detail
            const hotel=await Hotel.findById(req.params.hotelid).populate({
                path:"review",populate:{path:"user"}
              }).populate("rooms");
            const allHotel=await Hotel.find({owner:req.params.ownerid}).populate({ path:"review",populate:{path:"user"} }).populate("rooms").populate("owner")
              res.status(200).json({hotel,allHotel});
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
            .then(async (rooms) => {
            const allHotel=await Hotel.find({owner:req.params.ownerid}).populate({ path:"review",populate:{path:"user"} }).populate("rooms").populate("owner")
            res.status(200).json({rooms,allHotel})
            })
            .catch(error => {
            next(error)
            });
        })
    }catch(error){
        next(error);
    }
}