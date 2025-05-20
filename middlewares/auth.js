import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import User from "../models/userModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const accessToken = authHeader?.replace("Bearer ", "");

  if (!accessToken) {
    return next(new ErrorHandler("Please log in to access this resource", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired access token", 401));
  }

  const user = await User.findById(decoded.id).select(
    "-password -refreshToken"
  );

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  req.user = user;
  // console.log("req.user:", req.user);
  next();
});
