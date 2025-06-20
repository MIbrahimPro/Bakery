// models/Item.js
const mongoose = require("mongoose");
const imageCleanup = require("../middlewares/imageCleanup");

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

itemSchema.plugin(imageCleanup, { field: "image", folder: "items" });

module.exports = mongoose.model("Item", itemSchema);
