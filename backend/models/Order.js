// models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    subTotal: { type: Number, required: true },
});

const addressSchema = new mongoose.Schema({
    title: { type: String },
    address: { type: String },
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        totalPrice: { type: Number, required: true },
        orderTime: { type: Date, default: Date.now },
        deliveryLocation: addressSchema,
        paymentMethod: {
            type: String,
            enum: ["cash", "card", "online"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        orderStatus: {
            type: String,
            enum: [
                "new",
                "preparing",
                "out-for-delivery",
                "delivered",
                "cancelled",
            ],
            default: "new",
        },
        items: [orderItemSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
