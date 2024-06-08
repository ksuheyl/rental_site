import { compile } from "ejs";
import mongoose from "mongoose";

const { Schema } = mongoose;

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Username area is required"],
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "Email area is required"],
  },
  phoneNumber: {
    type: Number,
  },
  massage: {
    type: String,
  },
  completed: {
    type: Number,
    default: 0,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
