import mongoose from "mongoose";

const reviewSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
    },
    user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }

},{timestamps:true});

const Review=mongoose.model("Review",reviewSchema);
export default Review;