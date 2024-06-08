import Advert from "../models/advert.js";
import Reservation from "../models/reservationModel.js";
import Comment from "../models/commentModel.js";
import { v2 as cloudinary } from "cloudinary";
import { ObjectId } from "mongodb";
import fs, { close } from "fs";

const createAdvert = async (req, res) => {
  const data = req.body;
  console.log(req.files.image.tempFilePath);
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "rental_site",
    }
  );
  try {
    await Advert.create({
      name: data.name,
      adress: data.adress,
      vehicle_type: data.vehicle_type,
      description: data.description,
      price: data.price,
      user: res.locals.user._id,
      url: result.secure_url,
      image_id: result.public_id,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    res.status(201).redirect("/users/dashboard");
  } catch (error) {
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};

const getAllAdverts = async (req, res) => {
  try {
    const adverts = await Advert.find({});
    res.status(200).render("advert", {
      adverts,
      link: "adverts",
    });
  } catch (error) {
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};

const getFilterAdverts = async (req, res) => {
  try {
    const adverts = await Advert.find({
      vehicle_type: { $in: req.params.vehicle },
    });
    res.status(200).render("advert", {
      adverts,
      link: "adverts",
    });
  } catch (error) {
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};

const getSearch = async (req, res) => {
  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
  if (req.query.look) {
    const regex = new RegExp(escapeRegex(req.query.look), "gi");
    const adverts = await Advert.find({
      $or: [
        { name: regex },
        { adress: regex },
        { vehicle_type: regex },
        { description: regex },
        { url: regex },
      ],
    });
    res.status(200).render("advert", {
      adverts,
      link: "adverts",
    });
  } else {
    res.status(400).send("Query parameter 'look' is required.");
  }
};

const getAAdvert = async (req, res) => {
  try {
    var startingDate = [];
    var endDate = [];
    var reservations = await Reservation.find({
      advertId: { $in: req.params.id },
    });
    if (reservations[0] == undefined) {
      startingDate[0] = 0;
      endDate[0] = 0;
    } else {
      for (let i = 0; i < reservations.length; i++) {
        startingDate[i] = reservations[i].startingDate;
        endDate[i] = reservations[i].endDate;
      }
    }

    const comments = await Comment.find({
      advertID: { $in: req.params.id },
    }).populate("user");
    const details = await Advert.findById({ _id: req.params.id }).populate(
      "user"
    );
    res.status(200).render("AdvertDetails", {
      comments,
      startingDate,
      endDate,
      details,
      link: "adverts",
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

const deleteAdvert = async (req, res) => {
  try {
    const advert = await Advert.findById(req.params.id);
    const comment = await Comment.find({ advertID: { $in: req.params.id } });
    const advertId = advert.image_id;
    const commentId = comment.advertID;

    await cloudinary.uploader.destroy(advertId);
    await Advert.findByIdAndDelete({ _id: req.params.id });
    await Comment.deleteMany({ advertID: commentId });

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};

const createComment = async (req, res) => {
  const data = req.body;
  try {
    await Comment.create({
      comment: data.comment,
      user: res.locals.user._id,
      rating: data.rating,
      advertID: data.advertID,
    });
    res.status(201).redirect(`/advert/${data.advertID}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};

const createReservation = async (req, res) => {
  const data = req.body;
  try {
    const doubleCheck = await Reservation.find({
      advertId: { $in: data.advertId },
    });
    for (let k = 0; k < doubleCheck.length; k++) {
      const checkDate = new Date(data.startingDate);
      if (
        data.advertId.toString() === doubleCheck[k].advertId.toString() &&
        checkDate.getTime() === doubleCheck[k].startingDate.getTime()
      ) {
        return res.status(400).redirect("/");
      }
    }
    for (let i = 0; i < doubleCheck.length; i++) {
      for (let j = i + 1; j < doubleCheck.length; j++) {
        if (
          doubleCheck[i].startingDate.getTime() ===
          doubleCheck[j].startingDate.getTime()
        ) {
          return res.status(400).redirect("/");
        }
      }
    }
    const startingDate = new Date(data.startingDate);
    const endDate = new Date(data.endDate);
    const differenceInMilliseconds = endDate.getTime() - startingDate.getTime();

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    var differenceInDays = differenceInMilliseconds / millisecondsPerDay;
    if (differenceInDays == 0) {
      differenceInDays = 1;
    }
    await Reservation.create({
      advertId: data.advertId,
      hirerId: res.locals.user._id,
      startingDate: data.startingDate,
      endDate: data.endDate,
      paymentStatus: data.paymentStatus,
      price: data.price * differenceInDays,
      ownerId: data.ownerId,
    });
    res.status(201).render("succeed", {
      link: "",
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
  createAdvert,
  getAllAdverts,
  getAAdvert,
  createComment,
  getFilterAdverts,
  deleteAdvert,
  createReservation,
  getSearch,
};
