const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'name is required'] },
    price: { type: Number, required: [true, 'price is required'] },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model("product", productSchema)