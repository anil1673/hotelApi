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
    const savedHotel = await newHotel.save().then(async(hotel)=>{
      const allHotel=await Hotel.find().populate("owner");
      res.status(200).json({allHotel,savedHotel});
    });


  
  
  }catch(error){
    next(error);
  }
};
        
    // export const createHotel=async(req,res,next)=>{
    //   try{
    //     const newHotel=new Hotel(req.body);
    //     const updateOwner=await Owner.findByIdAndUpdate(req.owner._id,{$push:{hotel:newHotel._id}},{new:true});
    //     const saveHotel=await newHotel.save().then(async(hotel)=>{
    //     const allHotel=await Hotel.find();
    //     res.status(200).json({newHotel:hotel,allHotel:allHotel});
    //     });
    //   }catch(error){
    //     next(error)

    //   }
    // }




// update hotel
export const updateHotel=async(req,res,next)=>{
   try{ 
    const updatedHotel=await Hotel.findByIdAndUpdate(req.params.hotelid,{$set:req.body},{new:true}).then((hotel)=>{
      res.status(200).json({updatedHotel:hotel,allHotel:allHotel})
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
          
            res.status(200).json(room)
          })
          .catch(error => {
            next(error)
          });
        res.status(200).json("deleted successfully!!!!!");

 
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
        .then(hotels => {
          res.status(200).json(hotels)
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

