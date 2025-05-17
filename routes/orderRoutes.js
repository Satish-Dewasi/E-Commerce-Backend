import express from "express";
import {
  checkoutController,
  updatePaymentStatus,
} from "../controllers/orderController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/orders/checkouts").post(isAuthenticated, checkoutController);
router
  .route("/orders/payment-update")
  .post(isAuthenticated, updatePaymentStatus);

export default router;
