// routes/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

const router = express.Router();

/**
 * === Profile (authenticated user) ===
 */

// PUT  /users/me/update-name
router.put("/me/update-name", authenticateToken, async (req, res) => {
    const { name } = req.body;
    req.user.name = name;
    await req.user.save();
    res.json({ message: "Name updated", user: req.user });
});

// PUT  /users/me/change-password
router.put("/me/change-password", authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    console.log(
        "[CHANGE PASSWORD] user:",
        req.user && req.user.email,
        "body:",
        req.body
    );
    if (!req.user || !req.user.password) {
        console.log("[CHANGE PASSWORD] No user or password");
        return res.status(400).json({ message: "User or password not found" });
    }
    if (!oldPassword || !newPassword) {
        console.log("[CHANGE PASSWORD] Missing old or new password");
        return res
            .status(400)
            .json({ message: "Old and new password are required" });
    }
    const match = await bcrypt.compare(oldPassword, req.user.password);
    if (!match) {
        console.log("[CHANGE PASSWORD] Old password incorrect");
        return res.status(400).json({ message: "Old password incorrect" });
    }
    req.user.password = await bcrypt.hash(newPassword, 12);
    await req.user.save();
    console.log("[CHANGE PASSWORD] Password changed for user:", req.user.email);
    res.json({ message: "Password changed" });
});

// POST /users/me/address
router.post("/me/address", authenticateToken, async (req, res) => {
    const { title, address } = req.body;
    req.user.locations.push({ title, address });
    await req.user.save();
    res.status(201).json(req.user.locations);
});

// PUT  /users/me/address/:addressId
router.put("/me/address/:addressId", authenticateToken, async (req, res) => {
    const addr = req.user.locations.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: "Address not found" });
    addr.set(req.body);
    await req.user.save();
    res.json(req.user.locations);
});

// DELETE /users/me/address/:addressId
router.delete("/me/address/:addressId", authenticateToken, async (req, res) => {
    req.user.locations = req.user.locations.filter(
        (loc) => loc._id.toString() !== req.params.addressId
    );
    await req.user.save();
    res.json(req.user.locations);
});

// GET   /users/me/addresses
router.get("/me/addresses", authenticateToken, async (req, res) => {
    res.json(req.user.locations);
});

// GET /users/me/is-admin
router.get("/me/is-admin", authenticateToken, (req, res) => {
    res.json({ isAdmin: req.user.role === "admin" });
});

/**
 * === Admin user management ===
 */

// GET   /users/admin/users
router.get(
    "/admin/users",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        const users = await User.find().select("-password");
        res.json(users);
    }
);

// GET   /users/admin/user/:id
router.get(
    "/admin/user/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    }
);

// PUT   /users/admin/user/:id
// Only role may be updated
router.put(
    "/admin/user/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        const { role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.role = role;
        await user.save();
        res.json({ message: "Role updated", user: { id: user.id, role } });
    }
);

// DELETE /users/admin/user/:id
router.delete(
    "/admin/user/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    }
);

module.exports = router;
