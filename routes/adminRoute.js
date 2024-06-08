import express from "express";
import * as adminController from "../controllers/adminController.js";

const router = express.Router();

router.route("/").get(adminController.getAdminPage);
router.route("/message").get(adminController.getUserMessage);
router.route("/message/completed").get(adminController.getCompletedUserMessage);
router.route("/message/:id").put(adminController.userMessageCompleted);
router.route("/users").get(adminController.getUserControl);
router.route("/users/:id").delete(adminController.deleteUser);
router.route("/updateUser/:id").put(adminController.UpdateUser);
router.route("/updateUser/:id").get(adminController.getUpdateUser);
router.route("/reservation").get(adminController.getReservationController);
router.route("/reservation/:id").delete(adminController.deleteReservation);

export default router;
