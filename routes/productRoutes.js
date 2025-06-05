import express from "express";
import {
  getAllProducts,
  getCategoriesWithProductCount,
  getProductsByCategory,
  getProductsById,
  getRandomProducts,
  getSingleProductsByCategory,
  newProduct,
  searchProduct,
} from "../controllers/productController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Admin route (specific and protected)
router.route("/admin/product/new").post(isAuthenticated, newProduct);

// Search route (exact match, no dynamic parameters)
router.route("/products/search").get(searchProduct);

// Get all products (no dynamic parameters)
router.route("/products").get(getAllProducts);
router.route("/products/random/:number").get(getRandomProducts);

// Get single product by category and product ID (more specific dynamic route)
router
  .route("/products/category/:category/:productId")
  .get(getSingleProductsByCategory);

// Get single product by product ID (most generic dynamic route)
router.route("/products/:productId").get(getProductsById);

// Get all the categoty with stocks
router
  .route("/getCategoriesWithProductCount")
  .get(getCategoriesWithProductCount);

export default router;
