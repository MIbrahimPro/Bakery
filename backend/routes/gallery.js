// routes/gallery.js
const express = require("express");
const Gallery = require("../models/Gallery");
const { uploadGalleryImage } = require("../middlewares/upload");
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

const router = express.Router();

// GET /gallery/all
router.get("/all", async (req, res) => {
    res.json(await Gallery.find());
});

// GET /gallery/:id
router.get("/:id", async (req, res) => {
    const g = await Gallery.findById(req.params.id);
    if (!g) return res.status(404).json({ message: "Not found" });
    res.json(g);
});

// POST /gallery/admin/add
router.post(
    "/admin/add",
    authenticateToken,
    requireAdmin,
    uploadGalleryImage,
    async (req, res) => {
        const { title, description } = req.body;
        const image = req.file.filename;
        const item = new Gallery({ title, description, imageUrl: image });
        await item.save();
        res.status(201).json(item);
    }
);

// PUT /gallery/admin/change/:id
router.put(
    "/admin/change/:id",
    authenticateToken,
    requireAdmin,
    uploadGalleryImage,
    async (req, res) => {
        const update = { ...req.body };
        if (req.file) update.imageUrl = req.file.filename;
        const g = await Gallery.findByIdAndUpdate(req.params.id, update, {
            new: true,
        });
        if (!g) return res.status(404).json({ message: "Not found" });
        res.json(g);
    }
);

// DELETE /gallery/admin/delete/:id
router.delete(
    "/admin/delete/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    }
);

module.exports = router;
