// routes/contests.js
const express = require("express");
const Contest = require("../models/Contest");
const { uploadContestImage } = require("../middlewares/upload");
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

const router = express.Router();

// POST /contests/post
router.post("/post", uploadContestImage, async (req, res) => {
    const { title, description, userId } = req.body;
    const imageUrl = req.file?.filename;
    const c = new Contest({ title, description, imageUrl, user: userId });
    await c.save();
    res.status(201).json(c);
});

// GET  /contests/get
// Admin‑only listing
router.get("/get", authenticateToken, requireAdmin, async (req, res) => {
    const all = await Contest.find().populate("user", "name email");
    res.json(all);
});

// GET  /contests/get/:id
router.get("/get/:id", async (req, res) => {
    const c = await Contest.findById(req.params.id).populate("user", "name");
    if (!c) return res.status(404).json({ message: "Not found" });
    res.json(c);
});

// PUT  /contests/update/:id
router.put(
    "/update/:id",
    authenticateToken,
    requireAdmin,
    uploadContestImage,
    async (req, res) => {
        const update = { ...req.body };
        if (req.file) update.imageUrl = req.file.filename;
        const c = await Contest.findByIdAndUpdate(req.params.id, update, {
            new: true,
        });
        if (!c) return res.status(404).json({ message: "Not found" });
        res.json(c);
    }
);

// DELETE /contests/delete/:id
router.delete(
    "/delete/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        await Contest.findOneAndDelete({ _id: req.params.id });
        res.json({ message: "Contest deleted" });
    }
);

module.exports = router;
