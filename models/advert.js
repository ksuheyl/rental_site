import mongoose from "mongoose";

const { Schema } = mongoose;

const advertSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  adress: {
    type: String,
    required: true,
    trim: true,
  },
  vehicle_type: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  url: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  image_id:{
    type:String,
  }
});


const Advert = mongoose.model("advert", advertSchema);

export default Advert;

