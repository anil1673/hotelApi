import Booking from "../models/booking.js";
import Hotel from "../models/hotel.js";
import Review from "../models/review.js";
import Room from "../models/room.js";
import User from "../models/user.js";


// uplaod profile pic to cloudinary
export const updloadProfilePicToClodinary = async (req, res, next) => {
    try {
        console.log(req.file.path);
        res.status(200).json({ url: req.file.path });
    } catch (error) {
        next(error)
    }
}

// UPDATE PROFILE PIC
export const updateProfile = async (req, res, next) => {
    try {
        if (req.body.url) {
            await User.findByIdAndUpdate(req.params.userid, { $set: { ...req.body, img: req.body.url } }, { new: true }).then((user) => {
                res.status(200).json({ user });
            }).catch((error) => {
                next(error);
            })
        } else {
            await User.findByIdAndUpdate(req.params.userid, { $set: req.body }, { new: true }).then((user) => {
                console.log(user)
                res.status(200).json({ user });
            }).catch((error) => {
                next(error);
            })
        }

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
        const hotel = await Hotel.find().populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
        res.status(200).json({ hotel })

    } catch (error) {
        next(error);
    }
}

// get specific hotel
export const getSingleHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
        res.status(200).json({ hotel })
    } catch (error) {
        next(error)
    }
}


// get specific hotel without authorization
export const getSingleHotelNoAuth = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelid).populate({ path: "review", populate: { path: "user" } }).populate({ path: "rooms", populate: { path: "user" } }).populate("owner");
        res.status(200).json({ hotel })
    } catch (error) {
        next(error)
    }
}

// book Hotel
export const booking = async (req, res, next) => {
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
                    const booking= await Booking.findById(book._id).populate("hotel").populate("room").populate("user");
                    res.status(200).json({ booking });
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
export const cancelBooking = async (req, res, next) => {
    try {
        const { hotelid, userid, roomid, bookingid } = req.params;

        await User.findByIdAndUpdate(userid, { $pull: { booking: bookingid } }, { new: true }).then(async () => {
            await Room.findByIdAndUpdate(roomid, { $set: { user: null, status: true } }, { new: true }).then(async () => {
                const book=await Booking.findById(bookingid)
                await Booking.findByIdAndDelete(bookingid).then(async(g)=>{
                    const booking= await Booking.find({user:userid}).populate("hotel").populate("room").populate("user");
                    res.status(200).json({ booking });
                });
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



// export automatic unbooking
export const automaticUnBook = (req, res, next) => {
    try {
        console.log("first")
        setInterval(async () => {
            const date2 = new Date();
            // console.log(date1);
            const book = await Booking.find();
            await Promise.all(book.map(async (b) => {
                const date1 = b.endDate;
                if (date1 < date2) {
                    console.log("1", date1, date2);
                    let user = b.user;
                    let room = b.room;
                    let hotel = b.hotel;
                    let bid = b._id

                    await Booking.findByIdAndDelete(b._id).then(async () => {
                        await User.findByIdAndUpdate(user, { $pull: { booking: bid } }).then(async () => {
                            await Room.findByIdAndUpdate(room, { $set: { user: null } }).then(() => {

                            })
                        })
                    })
                }

            }))


        }, 2000); // 1 hour
        res.status(200).json("okkkkkkkk")

    } catch (error) {

    }
}

// get all bookings

export const getAllBooking = async (req, res, next) => {
    try {
        const booking = await Booking.find({ user: req.params.userid }).populate("hotel").populate("room").populate("user");
        res.status(200).json({ booking })
    } catch (error) {
        next(error)
    }
}



