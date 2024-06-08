import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: [true, "unique username area is required"],
      required: [true, "Username area is required"],
      lowercase: true,
      validate: [validator.isAlphanumeric, "Only string or integer"],
    },
    email: {
      type: String,
      required: [true, "Email area is required"],
      unique: [true, "e mail is invalid"],
      validate: [validator.isEmail, "Valid Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password area is required"],
      minLength: [4, "At least four characters"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    avatar: { type: String, default: "/images/avatar2.jpg"}
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    user.password = hash;
    next();
  });
});

const User = mongoose.model("User", userSchema);

export default User;
