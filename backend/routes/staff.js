// routes/staff.js
const express = require("express");
const Staff = require("../models/Staff");
const { uploadStaffImage } = require("../middlewares/upload");
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

const router = express.Router();

// GET /staff/all
router.get("/all", async (req, res) => {
    res.json(await Staff.find());
});

// GET /staff/:id
router.get("/:id", async (req, res) => {
    const s = await Staff.findById(req.params.id);
    if (!s) return res.status(404).json({ message: "Not found" });
    res.json(s);
});

// POST /staff/admin/add
router.post(
    "/admin/add",
    authenticateToken,
    requireAdmin,
    uploadStaffImage,
    async (req, res) => {
        const data = { ...req.body };
        if (req.file) data.pictureUrl = `/uploads/staff/${req.file.filename}`;
        const s = new Staff(data);
        await s.save();
        res.status(201).json(s);
    }
);

// PUT /staff/admin/change/:id
router.put(
    "/admin/change/:id",
    authenticateToken,
    requireAdmin,
    uploadStaffImage,
    async (req, res) => {
        try {
            const update = { ...req.body };
            if (req.file)
                update.pictureUrl = `/uploads/staff/${req.file.filename}`;
            const s = await Staff.findByIdAndUpdate(req.params.id, update, {
                new: true,
            });
            if (!s) return res.status(404).json({ message: "Not found" });
            res.json(s);
        } catch (err) {
            res.status(500).json({
                message: "Update failed",
                error: err.message,
            });
        }
    }
);

// DELETE /staff/admin/delete/:id
router.delete(
    "/admin/delete/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        await Staff.findOneAndDelete({ _id: req.params.id });
        res.json({ message: "Deleted" });
    }
);

module.exports = router;
