import express from "express";
import dotenv from "dotenv";
import errorMiddlware from "./middlewares/error.js";
import { connectDatabase } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Handling Uncaught Exceptions

process.on("uncaughtException", (err) => {
  console.log(`Error : ${err}`);
  console.log("Shutting down server due to Uncaught Exceptions");

  process.exit(1);
});

dotenv.config({ path: "../backend/config/config.env" });
app.use(cookieParser());
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://e-commerce-frontend-wdug.onrender.com",
];

app.use(
  cors((req, callback) => {
    const origin = req.header("Origin");
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, {
        origin: true,
        credentials: true,
      });
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  })
);

//origin: "http://localhost:5173",

// database connections
connectDatabase();

// routes user
app.get("/", (req, res) =>
  res.status(200).json({
    message: "Surver is Running",
  })
);
app.use("/api/v1", userRoutes);

// product routes
app.use("/api/v1", productRoutes);

// using error middleware
app.use(errorMiddlware);

const server = app.listen(5000, () => {
  console.log(
    `Server is running at PORT : ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

// Handling unhandled Promise rejections

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err}`);
  console.log("Shutting down server due to Unhandled Promise Rejections");

  server.close(() => {
    process.exit(1);
  });
});
