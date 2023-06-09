import Hotel from "../models/hotel.js";
import Room from "../models/room.js";
import Owner from "../models/owner.js";
import Booking from "../models/booking.js"

// create Room
export const createRoom = async (req, res, next) => {
    try {
        if (req.body.number === "" || req.body.type === "" || req.body.price === "") {
            res.status(200).json("number , type and price can't be empty");
        } else {
            if (req.body.url) {
                const newRoom = await new Room({ ...req.body, hotel: req.params.hotelid, owner: req.params.ownerid, img: req.body.url })
                await newRoom.save().then(async (newroom) => {
                    await Hotel.findByIdAndUpdate(req.params.hotelid, { $push: { rooms: newroom._id } }, { new: true }).then(async (h) => {
                        const hotel = await Hotel.findById(req.params.hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
                        // response
                        res.status(200).json({ hotel });
                    }).catch((error) => {
                        next(error)
                    })
                })
            } else {
                const newRoom = await new Room({ ...req.body, hotel: req.params.hotelid, owner: req.params.ownerid })
                await newRoom.save().then(async (newroom) => {
                    await Hotel.findByIdAndUpdate(req.params.hotelid, { $push: { rooms: newroom._id } }, { new: true }).then(async (h) => {
                        const hotel = await Hotel.findById(req.params.hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
                        // response
                        res.status(200).json({ hotel });
                    }).catch((error) => {
                        next(error)
                    })
                })
            }
        }

    } catch (error) {
        next(error);
    }
}

//upload profile pic  to cludinary
export const updloadRoomPicToClodinary = async (req, res, next) => {
    try {
        console.log(req.file.path);
        res.status(200).json({ url: req.file.path });

    } catch (error) {
        next(error)
    }
}

// // upload profile pic to room
// export const uploadRoomPicToRoom=async(req,res,next)=>{
//     try {
//         const {url}=req.body;
//         await Room.findByIdAndUpdate(req.params.roomid, { $set: {...req.body,img:url} }, { new: true }).then(async (room) => {
//             const hotel = await Hotel.findById(req.params.hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
//             res.status(200).json({ hotel });
//         }).catch((error) => {
//             next(error);
//         })
//     } catch (error) {
//         next(error)
//     }
// }




// update room
export const updateRoom = async (req, res, next) => {
    try {
        if (req.body.url) {
            await Room.findByIdAndUpdate(req.params.roomid, { $set: { ...req.body, img: req.body.url } }, { new: true }).then(async (updatedRoom) => {
                // fetch hotel complete detail
                const hotel = await Hotel.findById(req.params.hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
                // response
                res.status(200).json({ hotel });

            }).catch((error) => {
                next(error)
            });
        } else {
            await Room.findByIdAndUpdate(req.params.roomid, { $set: { ...req.body } }, { new: true }).then(async (updatedRoom) => {
                // fetch hotel complete detail
                const hotel = await Hotel.findById(req.params.hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
                // response
                res.status(200).json({ hotel });

            }).catch((error) => {
                next(error)
            });
        }


    } catch (error) {
        next(error)
    }
}


// delete room 
export const deleteRoom = async (req, res, next) => {
    try {
        await Hotel.findByIdAndUpdate(req.params.hotelid, { $pull: { rooms: req.params.roomid } }, { new: true }).then(async () => {
            await Room.findByIdAndDelete(req.params.roomid).then(async () => {
                // fetch hotel complete detail
                const hotel = await Hotel.findById(req.params.hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
                res.status(200).json({ hotel });
            }).catch((error) => {
                next(error)
            })
        })

    } catch (error) {
        next(error)
    }
}

// get all room of certain hotel
export const getAllRoom = async (req, res, next) => {
    try {
        await Hotel.findById(req.params.hotelid).then(async (h) => {
            const roomIds = h.rooms;
            Room.find({ _id: { $in: roomIds } })
                .then(async (rooms) => {
                    const hotel = await Hotel.findById(req.params.hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
                    res.status(200).json({ hotel })
                })
                .catch(error => {
                    next(error)
                });
        })
    } catch (error) {
        next(error);
    }
}

// get all booking of certain hotel

export const getAllBooking=async(req,res,next)=>{
    try{
       const owner= await Owner.findOne({_id:req.params.ownerid});

      const booking= await Booking.find({hotel:owner.hotel}).populate("hotel").populate("room").populate("user");
      if(booking.length!=0){
        res.status(200).json({booking})
      }else{
        res.status(200).json({booking})
      }

      

       
       
       

    }catch(error){
        next(error)
    }
}