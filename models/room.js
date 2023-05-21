import mongoose from "mongoose";

const roomSchema=new mongoose.Schema({
    number:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    img:{
        type:[String],
    },
    hotel:{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    status:{
        type:Boolean,
        default:false
    }

});

const Room=mongoose.model("Room",roomSchema);

export default Room;