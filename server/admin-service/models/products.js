import { Schema, model } from "mongoose";

const productSchema = new Schema({
  id: Number,
  title: String,
  description: String,
  price: String,
  image1: String,
  image2: String,
  image3: String,
  rating: {
    rate: String,
    count: String,
  },
  category: String,
  active: String,
});

export default model("product", productSchema);
