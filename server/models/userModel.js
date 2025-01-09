import mongoose, { Types } from "mongoose";

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationOTP:{
        type:String,
        default:''
    },
    mailCount:{
        type:Number,
        default:0
    }
})

let UserModel = mongoose.model.user || mongoose.model("user",UserSchema)
export default UserModel