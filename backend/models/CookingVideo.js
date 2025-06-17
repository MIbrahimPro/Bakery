// models/CookingVideo.js
const mongoose = require("mongoose");

const cookingVideoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        videoUrl: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CookingVideo", cookingVideoSchema);
