import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import User from "../models/userModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  //console.log(token);

  if (!token) {
    return next(
      new ErrorHandler("please login first to access this resource", 401)
    );
  }

  // verify and decode the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err)
      return res.status(403).json({
        message: err?.message || "error while verify aceess token",
      }); //invalid token
    //console.log(decoded);

    const user = await User.findById(decoded.id).select(
      "-password -refreshToken"
    );

    req.user = user;

    next();
  });
});
