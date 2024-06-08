import express from "express";
import * as userController from "../controllers/userController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/register").post(userController.createUser);
router.route("/login").post(userController.loginUser);
router.route("/dashboard").get(authMiddleware.authenticateToken, userController.getDashboardPage);
router.route("/user/:id").get(authMiddleware.authenticateToken, userController.getAUser);
router.route("/contact").post(userController.createMassage);
router.route("/rented").get(authMiddleware.authenticateToken, userController.getReservation);
router.route("/reservation").get(authMiddleware.authenticateToken, userController.getReservationPage);
router.route("/reservation/delete/:id").delete(userController.deleteUserReservation);








export default router;
