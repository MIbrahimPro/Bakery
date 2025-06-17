// middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

async function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
        return res
            .status(401)
            .json({ message: "Missing Authorization header" });

    const token = authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "Invalid token format" });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        // attach user to req
        req.user = await User.findById(payload.id).select("-password");
        if (!req.user) throw new Error("User not found");
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

function requireAdmin(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin privileges required" });
    }
    next();
}

module.exports = {
    authenticateToken,
    requireAdmin,
    JWT_SECRET,
};
