// routes/cookingVideos.js
const express = require("express");
const CVideo = require("../models/CookingVideo");
const { uploadCookingVideo } = require("../middlewares/upload");
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

const router = express.Router();

// GET /cooking-videos/all
router.get("/all", async (req, res) => {
    res.json(await CVideo.find());
});

// GET /cooking-videos/:id
router.get("/:id", async (req, res) => {
    const v = await CVideo.findById(req.params.id);
    if (!v) return res.status(404).json({ message: "Not found" });
    res.json(v);
});

// POST /cooking-videos/admin/add
router.post(
    "/admin/add",
    authenticateToken,
    requireAdmin,
    uploadCookingVideo,
    async (req, res) => {
        const { title, description } = req.body;
        const videoUrl = req.file
            ? `/uploads/cooking/${req.file.filename}`
            : null;
        const v = new CVideo({ title, description, videoUrl });
        await v.save();
        res.status(201).json(v);
    }
);

// PUT /cooking-videos/admin/change/:id
router.put(
    "/admin/change/:id",
    authenticateToken,
    requireAdmin,
    uploadCookingVideo,
    async (req, res) => {
        const update = { ...req.body };
        // If a new file is uploaded, update the videoUrl
        if (req.file) {
            update.videoUrl = `/uploads/cooking/${req.file.filename}`;
        } else if (req.body.keepOldVideo === "true") {
            // Remove videoUrl from update so it doesn't overwrite
            delete update.videoUrl;
        } else {
            // If neither file nor keepOldVideo, clear the videoUrl (optional)
            // delete update.videoUrl;
        }
        const v = await CVideo.findByIdAndUpdate(req.params.id, update, {
            new: true,
        });
        if (!v) return res.status(404).json({ message: "Not found" });
        res.json(v);
    }
);

// DELETE /cooking-videos/admin/delete/:id
router.delete(
    "/admin/delete/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        await CVideo.findOneAndDelete({ _id: req.params.id });
        res.json({ message: "Deleted" });
    }
);

module.exports = router;
