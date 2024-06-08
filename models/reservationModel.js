import mongoose from "mongoose";

const { Schema } = mongoose;

const reservationSchema = new Schema(
  {
    ownerId:{
      type: Schema.Types.ObjectId,
    },
    advertId: {
      type: Schema.Types.ObjectId,
    },
    hirerId: {
      type: Schema.Types.ObjectId,
    },
    startingDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    price: {
      type: Number,
    },
    paymentStatus: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Reservation = mongoose.model("reservation", reservationSchema);

export default Reservation;
