import express from "express";
import * as pageController from "../controllers/pageController.js";
import * as mapsController from "../controllers/mapsController.js";


const router = express.Router();

router.route("/").get(pageController.getIndexPage);
router.route("/about").get(pageController.getAboutPage);
router.route("/register").get(pageController.getRegisterPage);
router.route("/login").get(pageController.getLoginPage);
router.route("/logout").get(pageController.getLogout);
router.route("/contact").get(pageController.getContactPage);
router.route("/maps").get(mapsController.getMapsPage);
router.route("/maps/details").get(mapsController.getMapsDetails);
router.route("/AddressData").get(pageController.bringData);









export default router;
