// import cloudinary from "../cloudinary.js";
import Hotel from "../models/hotel.js";
import Owner from "../models/owner.js";
import Review from "../models/review.js";
import Room from "../models/room.js";

// create Hotel
export const createHotel=async(req,res,next)=>{
    try{
      // console.log(req.files)
      // for (const file of req.files) {
      //   // Upload each file to Cloudinary
      //   const result = await cloudinary.uploader.upload(file.path, {
      //     folder: 'uploads', // Optional folder for organizing uploaded images
      //     format: 'jpg', // Optional, specify the desired format
      //     // Additional upload parameters if needed
      //   });
  
      //   // Access the Cloudinary URL and other details
      //   console.log(result.secure_url);
  
      //   // Perform further processing or save the URL to a database
      // }
        
      //  const newHotel=new Hotel({...req.body,photos:result.secure_url});
      //  const updateOwner=await Owner.findByIdAndUpdate(req.owner._id,{$push:{hotel:newHotel._id}},{new:true});
      //  const saveHotel=await newHotel.save().then(async(hotel)=>{
      //   const allHotel=await Hotel.find();
      //   res.status(200).json({newHotel:hotel,allHotel:allHotel});
      //  });
        res.status(200).json("saveHotel");

    }catch(error){
        next(error)
    }

}



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

