const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    CountInStock: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    }
})

const Product = mongoose.model("product", productSchema);

module.exports = Product;