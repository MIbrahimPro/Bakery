// models/Gallery.js
const mongoose = require("mongoose");
const imageCleanup = require("../middlewares/imageCleanup");

const gallerySchema = new mongoose.Schema(
    {
        title: { type: String },
        description: { type: String },
        imageUrl: { type: String, required: true },
    },
    { timestamps: true }
);

gallerySchema.plugin(imageCleanup, { field: "imageUrl", folder: "gallery" });

module.exports = mongoose.model("Gallery", gallerySchema);
