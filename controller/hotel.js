import Hotel from "../models/hotel.js";
import Owner from "../models/owner.js";
import Review from "../models/review.js";
import Room from "../models/room.js";

// create Hotel
export const createHotel=async(req, res,next) => {
  try{
    // const photoPromises = req.files.map((file) =>
    //   file.path
    // );
    // const photoResults = await Promise.all(photoPromises);

    // Create new hotel document
    const newHotel = new Hotel({
      ...req.body,

      owner:req.params.ownerid
      // photos: photoResults,
      // Set other fields from the request body
    });

    // Save the hotel document to the database
    const savedHotel = await newHotel.save().then(async(h)=>{
      await Owner.findByIdAndUpdate(req.params.ownerid,{$push:{hotel:h._id}});
      const hotel = await Hotel.findById(h._id).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
      res.status(200).json({hotel});
    }); 
  }catch(error){
    next(error);
  }
};

//upload hotel pic 
export const updloadHotelPicToClodinary = async (req, res, next) => {
  try {
    const photoPromises = req.files.map((file) =>
      file.path
    );
    const photoResults = await Promise.all(photoPromises);

    // Create new hotel document
          res.status(200).json({ photoResults });
     
  } catch (error) {
      next(error)
  }
}

export const uploadRoomPicToHotel=async(req,res,next)=>{
  try {
      const {photoResults}=req.body;
      await Hotel.findByIdAndUpdate(req.params.hotelid, { $set: {...req.body,photos:photoResults} }, { new: true }).then(async (room) => {
          const hotel = await Hotel.findById(req.params.hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
          res.status(200).json({ hotel });
      }).catch((error) => {
          next(error);
      })
  } catch (error) {
      next(error)
  }
  
}


// update hotel
export const updateHotel=async(req,res,next)=>{
   try{ 
    const updatedHotel=await Hotel.findByIdAndUpdate(req.params.hotelid,{$set:req.body},{new:true}).then(async(h)=>{
      const hotel = await Hotel.findById(req.params.hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
      res.status(200).json({hotel})
    });

    }catch(error){
        console.log("first")
        next(error);
    }
}



// delete hotel
export const deleteHotel=async(req,res,next)=>{
    try{ 
        const hotel= await Hotel.findByIdAndDelete(req.params.hotelid);
        await Owner.findByIdAndUpdate(req.owner._id,{$pull:{hotel:req.params.hotelid}},{new:true});
        const roomIds=hotel.rooms;
        await Room.deleteMany({_id:{$in:roomIds}}).then(async (room) => {
          const hotel = await Hotel.findById(req.params.hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
            res.status(200).json("hotel deleted successfully")
          })
          .catch(error => {
            next(error)
          });


 
     }catch(error){
         console.log("first")
         next(error);
     }
 }



//  get all hotel
export const getAllHotel=async(req,res,next)=>{
    try{ 
    await Owner.findById(req.params.ownerid)
    .then(owner => {
      if (!owner) {
        console.log('owner not found');
        return;
      }
  
      // Retrieve the hotel IDs from the owner document
      const hotelIds = owner.hotel;
      // Find all hotels whose ID is contained in the owner's hotelIds array
      Hotel.find({ _id: { $in: hotelIds } })
        .then(hotel => {
          res.status(200).json(hotel)
        })
        .catch(error => {
          next(error)
        });
    })
    .catch(error => {
        next(error)
    });

     }catch(error){
         console.log("first")
         next(error);
     }
 }




//  get single hotel
export const getSingleHotel=async(req,res,next)=>{
    const hotel=await Hotel.findById(req.params.hotelid).populate({
      path:"review",populate:{path:"user"}
    }).populate("rooms");
    res.status(200).json({hotel});
}

