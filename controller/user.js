import Hotel from "../models/hotel.js";
import Review from "../models/review.js";
import Room from "../models/room.js";


// add review
export const addReview=async(req,res,next)=>{
    try{
        
        const newReview=new Review({...req.body,user:req.user._id});
        await newReview.save().then(async(review)=>{
            await Hotel.findByIdAndUpdate(req.params.hotelid,{$push:{review:review._id}},{new:true}).then(async(updatedHotel)=>{
                const hotel=await Hotel.findById(req.params.hotelid).populate({
                    path:"review",populate:{path:"user"}
                  }).populate("rooms");
                  res.status(200).json({hotel,updatedHotel,newReview});
            }).catch((error)=>{
                next(error);
            })
        }).catch(error=>{
            next(error);
        })
    }catch(error){
        next(error)
    }
}


// get all review
export const getAllReview=async(req,res,next)=>{
    try{
        const hotel=await Hotel.findById(req.params.hotelid).then(async(hotel)=>{
            const reviewIds=hotel.review;
            Review.find({_id:{$in:reviewIds}}).populate("user").then(async(review)=>{
                const hotel=await Hotel.findById(req.params.hotelid).populate({
                    path:"review",populate:{path:"user"}
                  }).populate("rooms");
                  res.status(200).json({hotel,review});
            }).catch((error)=>{
                res.status(400).json({error:error})
            })
        })
    }catch(error){
        next(error);
    }
}