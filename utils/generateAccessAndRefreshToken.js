import User from "../models/userModel.js";
import ErrorHandler from "./ErrorHandler.js";

export const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    //console.log(user);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    //console.log(accessToken, refreshToken);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return new ErrorHandler(
      "error while generating access and refresh token",
      500
    );
  }
};
