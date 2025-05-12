import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    category: {
      type: String,
      enum: ["men", "women", "accessories"],
      required: [true, "Please select product category"],
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    color: {
      type: String,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          default: 0,
        },
        comment: {
          type: String,
        },
      },
    ],

    ratings: {
      type: Number,
      default: 0,
    },

    noOfReviews: {
      type: Number,
      default: 0,
    },

    images: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
