import express from "express";
import {
  getAllUserController,
  loginController,
  logoutController,
  refreshTokenEndpoint,
  registerController,
  userProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(registerController);
router.route("/login").post(loginController);
router.route("/refresh-token").post(refreshTokenEndpoint);
router.route("/logout").get(isAuthenticated, logoutController);
router.route("/profile").get(isAuthenticated, userProfile);

// admin routes
router.route("/admin/users").get(isAuthenticated, getAllUserController);

export default router;
