import { Schema, model } from "mongoose";

const itemsBoughtSchema = new Schema({
  userEmail: String,
  direction: Object,
  items: Object,
  totalPrice: String,
});

export default model("itemsBought", itemsBoughtSchema);
