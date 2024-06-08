import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema({
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
    trim: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  advertID: {
    type: Schema.Types.ObjectId,
    ref: "Advert",
  },
});

const Comment = mongoose.model("comment", commentSchema);

export default Comment;
