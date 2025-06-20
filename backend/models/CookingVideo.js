// models/CookingVideo.js
const mongoose = require("mongoose");
const imageCleanup = require("../middlewares/imageCleanup");

const cookingVideoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        videoUrl: { type: String, required: true },
    },
    { timestamps: true }
);

cookingVideoSchema.plugin(imageCleanup, {
    field: "videoUrl",
    folder: "cookingVideos",
});

module.exports = mongoose.model("Cooking", cookingVideoSchema);
