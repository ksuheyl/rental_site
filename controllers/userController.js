import User from "../models/userModel.js";
import Contact from "../models/contactModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Advert from "../models/advert.js";
import Reservation from "../models/reservationModel.js";
import { constants } from "fs/promises";
import { log } from "console";

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user: user._id });
  } catch (error) {
    let errors2 = {};

    if (error.keyPattern) {
      if (error.keyPattern.username) {
        errors2.username = "This username is already registered";
      }
      if (error.keyPattern.email) {
        errors2.email = "This email is already registered";
      }
    }

    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach((key) => {
        errors2[key] = error.errors[key].message;
      });
    }

    res.status(400).json(errors2);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    let same = false;

    if (user) {
      same = await bcrypt.compare(password, user.password);
    } else {
      return res.status(401).json({
        succeed: false,
        error: "Username or password is invalid",
      });
    }

    if (same) {
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });

      res.status(201).json({ user: user._id });
    } else {
      res.status(401).json({
        succeed: false,
        error: "Password are not matched",
      });
    }
  } catch (error) {
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
const getReservation = async (req, res) => {
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
    var adverts = [];
    const reservations = await Reservation.find({
      ownerId: { $in: res.locals.user._id },
    });
    for (var i = 0; i < reservations.length; i++) {
      var advert = await Advert.find({
        _id: { $in: reservations[i].advertId },
      });
      if (Array.isArray(advert) && advert.length === 0) {
        adverts.push(dumpData);
      } else {
        adverts.push(advert);
      }
    }
    res.render("usersRent", {
      link: "usersRent",
      reservations,
      adverts,
    });
  } catch (error) {
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};

const getReservationPage = async (req, res) => {
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
    var adverts = [];
    const reservations = await Reservation.find({
      hirerId: { $in: res.locals.user._id },
    });
    for (var i = 0; i < reservations.length; i++) {
      var advert = await Advert.find({
        _id: { $in: reservations[i].advertId },
      });
      if (Array.isArray(advert) && advert.length === 0) {
        adverts.push(dumpData);
      } else {
        adverts.push(advert);
      }
    }
    res.render("reservation", {
      link: "reservation",
      reservations,
      adverts,
    });
  } catch (error) {
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};
const deleteUserReservation = async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.status(200).redirect("/users/reservation");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};
const getDashboardPage = async (req, res) => {
  try {
    const adverts = await Advert.find({ user: res.locals.user._id });
    res.render("dashboard", {
      link: "dashboard",
      adverts,
    });
  } catch (error) {
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};

const getAUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    const adverts = await Advert.find({ user: user._id });

    res.status(200).render("user", {
      user,
      adverts,
      link: "users",
    });
  } catch (error) {
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};

const createMassage = async (req, res) => {
  const data = req.body;
  try {
    await Contact.create({
      name: data.name,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      massage: data.massage,
    });
    res.status(201).render("contact", {
      message: "Your message has been sent!",
      link: "contact",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};

export {
  createUser,
  loginUser,
  getDashboardPage,
  getAUser,
  createMassage,
  getReservationPage,
  deleteUserReservation,
  getReservation,
};
