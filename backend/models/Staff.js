// models/Staff.js
const mongoose = require("mongoose");
const imageCleanup = require("../middlewares/imageCleanup");

const staffSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        pictureUrl: { type: String },
        description: { type: String },
        role: { type: String },
    },
    { timestamps: true }
);

staffSchema.plugin(imageCleanup, { field: "pictureUrl", folder: "staff" });

module.exports = mongoose.model("Staff", staffSchema);
