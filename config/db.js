import mongoose from "mongoose";

export const connectDatabase = () => {
  let DB_URI = "";

  if (process.env.NODE_ENV === "production") DB_URI = process.env.DB_URI;
  else DB_URI = process.env.DB_URI;

  mongoose.connect(DB_URI).then((con) => {
    console.log(`mongoDB is connected with HOST : ${con?.connection?.host}`);
  });
};
