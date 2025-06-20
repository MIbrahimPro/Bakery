// routes/items.js
const express = require("express");
const Item = require("../models/Item");
const Category = require("../models/Category");
const { uploadItemImage } = require("../middlewares/upload");
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

const router = express.Router();

// GET /items/all
router.get("/all", async (req, res) => {
    const items = await Item.find().populate("category", "name").lean();
    res.json(items);
});

// GET /items/random2
router.get("/random2", async (req, res) => {
    const items = await Item.aggregate([{ $sample: { size: 2 } }]);
    res.json(items);
});

// GET /items/:ids
router.get("/:id", async (req, res) => {
    const item = await Item.findById(req.params.id).populate(
        "category",
        "name"
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
});

// GET /items/category/:id
router.get("/category/:id", async (req, res) => {
    const items = await Item.find({ category: req.params.id });
    res.json(items);
});

// POST /items/admin/add
router.post(
    "/admin/add",
    authenticateToken,
    requireAdmin,
    uploadItemImage,
    async (req, res) => {
        const data = { ...req.body };
        if (req.file) data.image = req.file.filename;
        const item = new Item(data);
        await item.save();
        res.status(201).json(item);
    }
);

// PUT /items/admin/change/:id
router.put(
    "/admin/change/:id",
    authenticateToken,
    requireAdmin,
    uploadItemImage,
    async (req, res) => {
        const update = { ...req.body };
        if (req.file) update.image = req.file.filename;
        const item = await Item.findByIdAndUpdate(req.params.id, update, {
            new: true,
        }).populate("category", "name");
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    }
);

// DELETE /items/admin/delete/:id
router.delete(
    "/admin/delete/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        await Item.findOneAndDelete({ _id: req.params.id });
        res.json({ message: "Item deleted" });
    }
);

module.exports = router;
