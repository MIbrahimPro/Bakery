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
                itemsCount: { $size: "$items" },
            },
        },
    ]);
    res.json(cats);
});

// GET /categories/propcheck
router.get("/propcheck", async (req, res) => {
    const exists = await Category.exists({ name: "prop" });
    res.json({ exists });
});

// POST /categories/admin/add
router.post(
    "/admin/add",
    authenticateToken,
    requireAdmin,
    uploadCategoryImage,
    async (req, res) => {
        const { name } = req.body;
        const image = req.file?.filename;
        const cat = new Category({ name, image });
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
            return res
                .status(400)
                .json({
                    message:
                        "Cannot delete: items still exist in this category",
                });
        }
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Category deleted" });
    }
);

module.exports = router;
