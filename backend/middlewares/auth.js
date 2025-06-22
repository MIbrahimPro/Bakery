// middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

async function authenticateToken(req, res, next) {
    // const authHeader = req.headers["authorization"];
    // if (!authHeader)
    //     return res
    //         .status(401)
    //         .json({ message: "Missing Authorization header" });

    let token =
        req.headers.authorization?.split(" ")[1] ||
        req.cookies?.token ||
        req.session?.token;

    if (!token)
        return res.status(401).json({ message: "Invalid token format" });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(payload.id);
        if (!req.user) throw new Error("User not found");
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

async function authenticateTokenOptional(req, res, next) {
    // const authHeader = req.headers["authorization"];
    // if (!authHeader)
    //     return res
    //         .status(401)
    //         .json({ message: "Missing Authorization header" });

    let token =
        req.headers.authorization?.split(" ")[1] ||
        req.cookies?.token ||
        req.session?.token;
    if (!token) {
        req.user = null;
        return next();
    } // Skip authentication if no token
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(payload.id);
        if (!req.user) throw new Error("User not found");
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired tokeeen" });
    }
}

function requireAdmin(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin privileges required" });
    }
    next();
}

async function authenticateTokenRequired(req, res, next) {
    // grab token from header / cookie / session, same as your optional version
    const token =
        req.headers.authorization?.split(" ")[1] ||
        req.cookies?.token ||
        req.session?.token;
    // if no token, force login
    if (!token) {
        req.flash("error", "You must be logged in to see that page.");
        return res.redirect("/views/login");
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id);
        if (!user) throw new Error("User not found");
        req.user = user;
        next();
    } catch (err) {
        req.flash("error", "Session expired—please log in again.");
        return res.redirect("/views/login");
    }
}

module.exports = {
    authenticateTokenRequired,
    authenticateToken,
    requireAdmin,
    JWT_SECRET,
    authenticateTokenOptional,
};
