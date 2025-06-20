// routes/general.js
const express = require("express");
const Config = require("../models/General");
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

const router = express.Router();

// GET  /general
router.get("/", async (req, res) => {
    const cfg = await Config.findOne();
    res.json(cfg);
});

// PUT  /general/change
router.put("/change", authenticateToken, requireAdmin, async (req, res) => {
    const update = req.body;
    const cfg = await Config.findOneAndUpdate({}, update, {
        new: true,
        upsert: true,
    });
    res.json({ message: "General config updated", config: cfg });
});

// POST /general/faq
router.post("/faq", authenticateToken, requireAdmin, async (req, res) => {
    const { question, answer } = req.body;
    const cfg = await Config.findOneAndUpdate(
        {},
        { $push: { faq: { question, answer } } },
        { new: true, upsert: true }
    );
    res.json({ message: "FAQ added", config: cfg });
});

// DELETE /general/faq/:faqId
router.delete(
    "/faq/:faqId",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        const cfg = await Config.findOneAndUpdate(
            {},
            { $pull: { faq: { _id: req.params.faqId } } },
            { new: true }
        );
        res.json({ message: "FAQ removed", config: cfg });
    }
);

module.exports = router;
