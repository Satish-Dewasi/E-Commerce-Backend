import mongoose from "mongoose";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// create new product  /admin/product/new
export const newProduct = catchAsyncErrors(async (req, res, next) => {
  //console.log("req.user.role:", req.user.role);

  if (req.user.role === "user") {
    return next(
      new ErrorHandler("You don't allow to access this resource.", 401)
    );
  }

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    message: "product created successfully",
    product,
  });
});

// get all products /products
export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const {
    category,
    minPrice,
    maxPrice,
    pageNumber = 1,
    resultPerPage = 12,
  } = req.query;

  let query = {
    price: {
      $gte: parseFloat(minPrice) || 0,
      $lte: parseFloat(maxPrice) || 1000,
    },
  };
  if (category) {
    query.category = category;
  }

  const skip = (pageNumber - 1) * resultPerPage;

  const products = await Product.find(query)
    .limit(resultPerPage)
    .skip(skip)
    .lean();

  const totalProducts = await Product.countDocuments();

  res.status(200).json({
    success: true,
    message: "product fatched successfully",
    totalProducts: totalProducts,
    pageNumber,
    products,
  });
});

// get product by  category  /products/:catetory
export const getProductsByCategory = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const { category } = req.params;
      const products = await Product.find({ category });

      if (!products) {
        return next(
          new ErrorHandler("products not found with this category", 404)
        );
      }
      res.status(200).json({
        success: true,
        message: `products with category ${category} `,
        noOfProducts: products.length,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler("Server Error", 500));
    }
  }
);

// get single product   /products/productID
export const getProductsById = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  // vlaidate product id
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(new ErrorHandler("Invalid product ID format", 400));
  }

  const product = await Product.findById(productId);
  //console.log(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Product found",
    product,
  });
});

// get single product from a category    /products/category/productID
export const getSingleProductsByCategory = catchAsyncErrors(
  async (req, res, next) => {
    const { category, productId } = req.params;

    //console.log(category);
    //console.log(productId);

    //validate product id
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new ErrorHandler("Invalid product ID format", 400));
    }

    const product = await Product.findById(productId);
    console.log(productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Product found",
      product,
    });
  }
);

// search product    /products/search?.....

export const searchProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return next(new ErrorHandler("search query is empty", 404));
    }

    // searching product base on keyword
    const products = await Product.find({
      name: { $regex: new RegExp(keyword, "i") },
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message,
      error,
    });
  }
});

// getting five random products  /store/random/:number

export const getRandomProducts = catchAsyncErrors(async (req, res, next) => {
  const { number } = req.params;

  const noOfRandomProducts = Number(number) || 5;

  const randomProducts = await Product.aggregate([
    { $sample: { size: noOfRandomProducts } },
  ]);

  res.status(200).json({
    success: true,
    count: randomProducts.length,
    products: randomProducts,
  });
});
