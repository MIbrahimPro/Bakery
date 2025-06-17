// models/Item.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        description: { type: String },
        image: { type: String },
        price: { type: Number, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
