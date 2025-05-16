import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Stripe from "stripe";
import ErrorHandler from "../utils/ErrorHandler.js";

export const checkoutController = catchAsyncErrors(async (req, res) => {
  //console.log(process.env.STRIPE_SECRET);

  const stripe = new Stripe(process.env.STRIPE_SECRET);

  const { cartItems, userId } = req.body;

  // console.log(cartItems);
  // console.log(userId);

  try {
    let totalAmount = 0;

    const productDetails = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item._id);
        // console.log(product);
        if (!product) throw new Error("Product not found");

        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;

        return {
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount, // in cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    const order = new Order({
      user: userId,
      products: productDetails,
      totalAmount,
      paymentIntentId: paymentIntent.id,
    });

    await order.save();

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Payment update controller

export const updatePaymentStatus = catchAsyncErrors(async (req, res) => {
  const { paymentIntentId, status } = req.body;

  try {
    const order = await Order.findById({ paymentIntentId });
    if (!order) {
      return next(new ErrorHandler("product not found", 404));
    }

    order.paymentStatus = status;

    await order.save();

    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Update Payment Status Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
