// models/Category.js
const mongoose = require("mongoose");
const imageCleanup = require("../middlewares/imageCleanup");

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String }, // store URL or path
        description: { type: String }, // new field for category description
    },
    { timestamps: true }
);

categorySchema.plugin(imageCleanup, { field: "image", folder: "categories" });

module.exports = mongoose.model("Category", categorySchema);
