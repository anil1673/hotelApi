import Booking from "../models/booking.js";
import Hotel from "../models/hotel.js";
import Review from "../models/review.js";
import Room from "../models/room.js";
import User from "../models/user.js";


// UPDATE PROFILE PIC
export const updateProfilepic = async (req, res, next) => {
    try {
        console.log(req.file.path);
        await User.findByIdAndUpdate(req.params.userid, { $set: { img: req.file.path } }, { new: true }).then((user) => {
            console.log(user)
            res.status(200).json({ user });
        }).catch((error) => {
            next(error);
        })
    } catch (error) {
        next(error)
    }
}

// add review
export const addReview = async (req, res, next) => {
    try {
        const newReview = new Review({ ...req.body, user: req.user._id });
        await newReview.save().then(async (review) => {
            await Hotel.findByIdAndUpdate(req.params.hotelid, { $push: { review: review._id } }, { new: true }).then(async (updatedHotel) => {
                const hotel = await Hotel.findById(req.params.hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
                res.status(200).json({ hotel });
            }).catch((error) => {
                next(error);
            })
        }).catch(error => {
            next(error);
        })
    } catch (error) {
        next(error)
    }
}


// get all review
export const getAllReview = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelid).then(async (hotel) => {
            const reviewIds = hotel.review;
            Review.find({ _id: { $in: reviewIds } }).populate("user").then(async (review) => {
                const hotel = await Hotel.findById(req.params.hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
                res.status(200).json({ hotel });
            }).catch((error) => {
                res.status(400).json({ error: error })
            })
        })
    } catch (error) {
        next(error);
    }
};


// get all hotel
export const getAllHotel = async (req, res, next) => {
    try {
        await Hotel.find().then((hotel) => {
            res.status(200).json({ hotel })
        }).catch((error) => {
            next(error)
        })

    } catch (error) {
        next(error);
    }
}

// book Hotel
export const booking = async (req,res,next) => {
    try {
        const { hotelid, roomid, userid } = req.params;
        const newBooking = new Booking({
            hotel: hotelid,
            room: roomid,
            user: userid,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        });

        await newBooking.save().then(async (book) => {
            await Room.findByIdAndUpdate(req.params.roomid, { $set: { status: false, user: userid } }, { new: true }).then(async () => {
                await User.findByIdAndUpdate(userid, { $push: { booking: book._id } }, { new: true }).then(async () => {
                    const hotel = await Hotel.findById(hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
                    res.status(200).json({ hotel })
                }).catch((error) => {
                    next(error);
                })
            }).catch((error) => {
                next(error);
            })
        }).catch((error) => {
            next(error);
        })

    } catch (error) {
        next(error)
    }
}

// cancel booking
export const cancelBooking=async(req,res,next)=>{
    try{
        const {hotelid,userid,roomid,bookingid}=req.params;
        await User.findByIdAndUpdate(userid,{$pull:{booking:bookingid}},{new:true}).then(async()=>{
            await Room.findByIdAndUpdate(roomid,{$set:{user:null,status:true}},{new:true}).then(async()=>{
                await Booking.findByIdAndDelete(bookingid);
                const hotel = await Hotel.findById(hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");

                res.status(200).json({hotel});
            }).catch((error) => {
            next(error);
        })
        }).catch((error) => {
            next(error);
        })
    }catch(error){
        next(error)
    }
}


// get all bookings

export const getAllBooking=async(req,res,next)=>{
    try{
        const booking=await Booking.find({user:req.params.userid}).populate("hotel").populate("room").populate("user");
        res.status(200).json({booking})
    }catch(error){
        next(error)
    }
}

