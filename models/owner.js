import mongoose from "mongoose";
const OwnerSchema=new mongoose.Schema({
    ownername:{
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
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
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
        default:true,
    },
    hotel:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }]

},{
    timestamps:true
});


// model

const Owner=mongoose.model("Owner",OwnerSchema);

export default Owner;