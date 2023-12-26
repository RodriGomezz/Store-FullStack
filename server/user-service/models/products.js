import {Schema, model} from "mongoose"

const productSchema = new Schema({
    title: String,
    price: String,
    description: String,
    img: String,
})

export default model("product", productSchema)