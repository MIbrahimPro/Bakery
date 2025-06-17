// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateToken, JWT_SECRET } = require("../middlewares/auth");

const router = express.Router();

// POST /auth/signup
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    if (await User.exists({ email })) {
        return res.status(400).json({ message: "Email already registered" });
    }
    const hash = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hash });
    await user.save();
    res.status(201).json({ message: "User created" });
});

// POST /auth/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
});

// GET /auth/me
router.get("/me", authenticateToken, (req, res) => {
    res.json(req.user);
});

module.exports = router;
