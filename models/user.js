import mongoose from "mongoose";
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        requried:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    country: {
        type: String,
      },
    img: {
        type: String,
      },
    city: {
        type: String,
      },
    isOwner:{
        type:Boolean,
        default:false,
    },
    review:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]

},{
    timestamps:true
});


// model

const User=mongoose.model("User",UserSchema);

export default User;