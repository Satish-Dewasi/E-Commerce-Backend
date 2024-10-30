import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";
import sendToken from "../utils/sendToken.js";
import jwt from "jsonwebtoken";

// Register user
export const registerController = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  // getting jwt token
  //sendToken(res, user._id);

  res.status(201).json({
    success: true,
    message: "user registered successfully",
  });
});

// Login user
export const loginController = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // find user in databse
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("wrong password", 401));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  //console.log("tokens :", accessToken, refreshToken);

  const options = {
    httpOnly: true,
    secure: true,
  };

  res.status(200).cookie("refreshToken", refreshToken, options).json({
    success: true,
    message: "user login successfully",
    accessToken,
  });
});

// logout user
export const logoutController = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// get user profile /me

export const userProfile = catchAsyncErrors(async (req, res, next) => {
  //const id = req?.user?._id;
  //console.log("req.user" + req.user);

  //const user = await User.findById(id);

  const user = req.user;

  if (!user) {
    return next(new ErrorHandler("login please", 401));
  }

  res.status(200).json({
    success: true,
    message: "user profile fatched",
    user,
  });
});

// generate new access token
export const refreshTokenEndpoint = async (req, res) => {
  const { refreshToken } = req.cookies;
  //console.log(refreshToken);

  // verify and decode the token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: err?.message || "invalid refresh token",
        });
      }

      try {
        const user = await User.findById(decoded.id).select();

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (refreshToken !== user.refreshToken) {
          return res.status(403).json({ message: "Invalid or corrupt token" });
        }

        const accessToken = user.generateAccessToken();

        return res.status(201).json({
          success: true,
          accessToken,
        });
      } catch (error) {
        return res.status(500).json({
          message: "Internal server error",
        });
      }
    }
  );
};
