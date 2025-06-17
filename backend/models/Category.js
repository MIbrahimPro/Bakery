// models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String }, // store URL or path
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
