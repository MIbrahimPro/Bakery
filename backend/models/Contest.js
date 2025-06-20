// models/Contest.js
const mongoose = require("mongoose");
const imageCleanup = require("../middlewares/imageCleanup");

const contestSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String }, // your “describtion and recipe”
        imageUrl: { type: String }, // filename stored via multer
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

contestSchema.plugin(imageCleanup, { field: "imageUrl", folder: "contests" });

module.exports = mongoose.model("Contest", contestSchema);
