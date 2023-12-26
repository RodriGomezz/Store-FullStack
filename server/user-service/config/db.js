import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://Rodri:${process.env.PASSWORD}@cluster0.owrvkng.mongodb.net/Store`
  )
  .then(() => console.log("database connected"))
  .catch((error) => console.log(error));
