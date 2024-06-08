import Advert from "../models/advert.js";

const getMapsPage = async (req, res) => {
  try {
    res.status(200).render("maps", {
      link: "maps",
    });
  } catch (error) {
    res.status(500).json({
      succeed: false,
      error,
    });
  }
};

const getMapsDetails = async (req, res) => {
  try {
    const adverts = await Advert.find({});

    res.status(200).json({
      succeed: true,
      adverts: adverts,
    });
  } catch (error) {
    res.status(500).json({
      succeed: false,
    });
  }
};

export { getMapsPage, getMapsDetails };
