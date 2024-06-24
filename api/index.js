import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Il Database MongoDB e' connesso");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

app.listen(3002, () => {
  console.log("Server is running on port 3002!!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
