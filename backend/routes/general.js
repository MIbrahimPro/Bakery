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
    const cfg = await Config.findOneAndUpdate({}, update, { new: true });
    res.json({ message: "General config updated", config: cfg });
});

module.exports = router;
