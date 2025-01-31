import mongoose from "mongoose";
import { Schema, Types } from "mongoose";


const courseSchema = mongoose.Schema({
  img: String,
  name: String,
  by: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  price: Number,
  discountedprice: Number,
  trending:{
    type:Boolean,
    default:false
  },
  videosLink:[]
});

const courseModel = mongoose.model.course || mongoose.model("course", courseSchema);

export default courseModel;
