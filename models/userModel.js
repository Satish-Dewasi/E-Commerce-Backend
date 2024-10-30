import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [6, "Password must have atleast 6 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    refreshToken: String,

    // for reset password
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Encrypting password before savivng
userSchema.pre("save", async function (next) {
  // if password field is not modified
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// assining json web token to user
userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

export default mongoose.model("User", userSchema);
