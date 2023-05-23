import mongoose, { mongo }  from "mongoose";

const bookingSchema = new mongoose.Schema({
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    startDate: {
        type:Date,
        required:true,
    },
    endDate: {
        type:Date,
        required:true,
    },
    isActive:{
        type:Boolean,
        default:true
    }
  });

const Booking=mongoose.model("Booking",bookingSchema);

export default Booking;