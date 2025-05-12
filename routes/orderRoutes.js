import express from "express";
import { checkoutController } from "../controllers/orderController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/orders/checkouts").post(checkoutController);

export default router;
