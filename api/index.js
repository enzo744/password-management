import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(
    process.env.MONGO
  )
  .then(() => {
    console.log("Il Database MongoDB e' connesso");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.listen(3002, () => {
  console.log("Server is running on port 3002!!");
});
