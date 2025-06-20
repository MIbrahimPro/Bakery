// routes/search.js
const express = require("express");
const Item = require("../models/Item");
const Category = require("../models/Category");
const router = express.Router();

// GET /search?q=term
router.get("/", async (req, res) => {
    const q = req.query.q || "";
    if (!q.trim()) return res.json([]);
    const regex = new RegExp(q, "i");

    // Find matching categories by name
    const categories = await Category.find({ name: regex });
    const categoryIds = categories.map((cat) => cat._id);

    // Search items by name/description (regex) or category (ObjectId)
    const items = await Item.find({
        $or: [
            { name: regex },
            { description: regex },
            { category: { $in: categoryIds } },
        ],
    });
    res.json(items);
});

module.exports = router;
