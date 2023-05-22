import mongoose from "mongoose";

const HotelSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
    },
    address:{
        type:String,
        required:true,
    },
    location:{
        type:Number
    },
    photos:[String],

    description:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        min:0,
        max:5
    },
    rooms:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    review:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }
    
},{timestamps:true});


const Hotel=mongoose.model("Hotel",HotelSchema);

export default Hotel;