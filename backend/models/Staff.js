// models/Staff.js
const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        pictureUrl: { type: String },
        description: { type: String },
        role: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
