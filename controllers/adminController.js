import { ObjectId } from "mongodb";
import User from "../models/userModel.js";
import Contact from "../models/contactModel.js";
import Advert from "../models/advert.js";
import Reservation from "../models/reservationModel.js";
import { link } from "fs";

const getAdminPage = async (req, res) => {
  try {
    const users = await User.find({});
    const adverts = await Advert.find({});
    res.status(200).render("admin/admin", {
      users,
      adverts,
      link: "admin",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};
const getUpdateUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    res.render("admin/updateUser", {
      link: "users",
      user,
      message: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};

const UpdateUser = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.params.id;
    console.log(data.username, data.email, data.role);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: data.username,
        email: data.email,
        role: data.role,
      },
      { new: true }
    );
    const user = await User.findById(userId);
    res.render("admin/updateUser", {
      link: "users",
      user,
      message: "User Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json();
  }
};

const deleteUser = async (req, res) => {
  try {
    await Advert.deleteMany({
      user: { $in: req.params.id },
    });
    await User.findByIdAndDelete({ _id: req.params.id });
    res.status(200).redirect("/admin/users");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};

const getUserMessage = async (req, res) => {
  const messages = await Contact.find({ completed: { $in: 0 } });
  res.render("admin/userMessage", {
    messages,
    link: "message",
  });
};
const getCompletedUserMessage = async (req, res) => {
  const messages = await Contact.find({ completed: { $in: 1 } });
  res.render("admin/userMessage", {
    messages,
    link: "completed",
  });
};

const getUserControl = async (req, res) => {
  try {
    var count = 0;
    const users = await User.find({ _id: { $ne: res.locals.user._id } });
    res.status(200).render("admin/users", {
      users,
      link: "users",
      count,
    });
  } catch (error) {
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};
const userMessageCompleted = async (req, res) => {
  try {
    const messageId = req.params.id;
    const complete = 1;

    await Contact.findByIdAndUpdate(
      messageId,
      { completed: complete },
      { new: true }
    );

    res.status(200).redirect("/admin/message");
  } catch (error) {
    console.log(error);
    res.status(500).json();
  }
};

const completedMassage = async (req, res) => {
  const data = req.body;
  try {
    const contact = Contact.findById(data.id);
    contact.completed = data.completed;
    contact.save();
    res.status(201).redirect("/admin/message");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};
const getReservationController = async (req, res) => {
  try {
    const dumpData = [
      {
        _id: "000000000000000000000000",
        name: "Removed",
        adress: "removed",
        vehicle_type: "removed",
        description: "removed",
        price: 0,
        user: "000000000000000000000000",
        url: "https://example.com/image.png",
        image_id: "example_image_id",
        uploadedAt: "2024-05-15T00:00:00.000Z",
        __v: 0,
      },
    ];

    const reservations = await Reservation.find({});
    const adverts = await Promise.all(
      reservations.map(async (reservation) => {
        const advert = await Advert.find({
          _id: { $in: reservation.advertId },
        });
        return Array.isArray(advert) && advert.length === 0 ? dumpData : advert;
      })
    );

    res.render("admin/reservationControl", {
      link: "reservationControl",
      reservations,
      adverts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      succeed: false,
    });
  }
};
const deleteReservation = async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.status(200).redirect("/admin/reservation");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};
export {
  getAdminPage,
  getUserMessage,
  getUserControl,
  completedMassage,
  deleteUser,
  userMessageCompleted,
  getCompletedUserMessage,
  getUpdateUser,
  UpdateUser,
  getReservationController,
  deleteReservation,
};
