import express from "express";
import * as advertController from "../controllers/advertController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import * as mapsController from "../controllers/mapsController.js";

const router = express.Router();

router.route("/").post(advertController.createAdvert);

router.route("/").get(advertController.getAllAdverts);

router
  .route("/comment")
  .post(authMiddleware.authenticateToken, advertController.createComment);

router.route("/search").get(advertController.getSearch);

router
  .route("/reservation")
  .post(authMiddleware.authenticateToken, advertController.createReservation);

router.route("/delete/:id").delete(advertController.deleteAdvert);


router.route("/filter/:vehicle").get(advertController.getFilterAdverts);

router.route("/:id").get(advertController.getAAdvert);

export default router;
