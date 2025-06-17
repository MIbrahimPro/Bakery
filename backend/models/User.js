// models/User.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    title: { type: String },
    address: { type: String },
});

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }, // hash before save!
        role: {
            type: String,
            enum: ["customer", "admin", "staff"],
            default: "customer",
        },
        locations: [addressSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
