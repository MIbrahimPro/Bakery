// routes/orders.js
const express = require("express");
const Order = require("../models/Order");
const Item = require("../models/Item");
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

const router = express.Router();

// POST /order
router.post("/", async (req, res) => {
    const { userId, items, deliveryLocation, paymentMethod } = req.body;
    // items: [{ itemId, quantity }]
    const detailed = await Promise.all(
        items.map(async ({ itemId, quantity }) => {
            const it = await Item.findById(itemId);
            return {
                item: it._id,
                name: it.name,
                quantity,
                price: it.price,
                subTotal: it.price * quantity,
            };
        })
    );

    const totalPrice = detailed.reduce((sum, x) => sum + x.subTotal, 0);
    const order = new Order({
        user: userId,
        items: detailed,
        totalPrice,
        deliveryLocation,
        paymentMethod,
    });
    await order.save();
    res.status(201).json(order);
});

// GET /order/my-orders/:userid
router.get("/my-orders/:userid", authenticateToken, async (req, res) => {
    if (req.user.id !== req.params.userid && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
    }
    const orders = await Order.find({ user: req.params.userid });
    res.json(orders);
});

// GET /order/this-order/:id
router.get("/this-order/:id", authenticateToken, async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
});

// GET /order/all-orders
router.get("/all-orders", authenticateToken, requireAdmin, async (req, res) => {
    const orders = await Order.find().populate("user", "email");
    res.json(orders);
});

// PUT /order/update/:id
router.put("/update/:id", authenticateToken, requireAdmin, async (req, res) => {
    const { paymentStatus, orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { paymentStatus, orderStatus },
        { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
});

// DELETE /order/delete/:id
router.delete(
    "/delete/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted" });
    }
);

module.exports = router;
