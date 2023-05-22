import mongoose from "mongoose";

const HotelSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
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

    cheapestPrice:{
        type:Number,
        required:true
    },
    features:{
        type:Boolean,
        default:false,
    },
    review:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }
    
},{timestamps:true});


const Hotel=mongoose.model("Hotel",HotelSchema);

export default Hotel;