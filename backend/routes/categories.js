// routes/categories.js
const express = require("express");
const Category = require("../models/Category");
const Item = require("../models/Item");
const { uploadCategoryImage } = require("../middlewares/upload");
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

const router = express.Router();

// GET /categories/all
router.get("/all", async (req, res) => {
    const cats = await Category.aggregate([
        {
            $match: { name: { $ne: "PartyProps" } }, // Exclude 'prop' category
        },
        {
            $lookup: {
                from: "items",
                localField: "_id",
                foreignField: "category",
                as: "items",
            },
        },
        {
            $project: {
                name: 1,
                image: 1,
                description: 1, // include description
                itemsCount: { $size: "$items" },
            },
        },
    ]);
    res.json(cats);
});

// GET /categories/propcheck
router.get("/propcheck", async (req, res) => {
    const exists = await Category.exists({ name: "PartyProps" });
    res.json({ exists });
});

// GET /categories/partyprops
router.get("/partyprops", async (req, res) => {
    const category = await Category.findOne({ name: "PartyProps" });
    if (!category) {
        return res
            .status(404)
            .json({ message: "PartyProps category not found" });
    }
    res.json(category);
});

router.get("/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category); // returns description by default
    } catch (err) {
        res.status(400).json({ message: "Invalid category ID" });
    }
});

// POST /categories/admin/add
router.post(
    "/admin/add",
    authenticateToken,
    requireAdmin,
    uploadCategoryImage,
    async (req, res) => {
        const { name, description } = req.body; // get description from body
        const image = req.file?.filename;
        const cat = new Category({ name, image, description });
        await cat.save();
        res.status(201).json(cat);
    }
);

// PUT /categories/admin/change/:id
router.put(
    "/admin/change/:id",
    authenticateToken,
    requireAdmin,
    uploadCategoryImage,
    async (req, res) => {
        const update = { ...req.body };
        if (req.file) update.image = req.file.filename;
        // description will be updated if present in req.body
        const cat = await Category.findByIdAndUpdate(req.params.id, update, {
            new: true,
        });
        if (!cat)
            return res.status(404).json({ message: "Category not found" });
        res.json(cat);
    }
);

// DELETE /categories/admin/delete/:id
router.delete(
    "/admin/delete/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        const count = await Item.countDocuments({ category: req.params.id });
        if (count > 0) {
            return res.status(400).json({
                message: "Cannot delete: items still exist in this category",
            });
        }
        await Category.findOneAndDelete({ _id: req.params.id });
        res.json({ message: "Category deleted" });
    }
);

// GET /categories/stats/today
router.get("/stats/today", async (req, res) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Find all orders from today
    const orders = await require("../models/Order")
        .find({
            orderTime: { $gte: start, $lte: end },
        })
        .populate("items.item");

    // Count items per category
    const categoryCounts = {};
    for (const order of orders) {
        for (const orderItem of order.items) {
            const item = orderItem.item;
            if (item && item.category) {
                const catId = item.category.toString();
                categoryCounts[catId] =
                    (categoryCounts[catId] || 0) + orderItem.quantity;
            }
        }
    }

    // Get category names
    const categories = await Category.find({
        _id: { $in: Object.keys(categoryCounts) },
    });
    const result = categories.map((cat) => ({
        _id: cat._id,
        name: cat.name,
        count: categoryCounts[cat._id.toString()] || 0,
    }));

    res.json(result);
});

module.exports = router;
