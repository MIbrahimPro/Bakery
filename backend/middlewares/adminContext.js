module.exports.adminContextMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        req.user = req.session.user;
    } else {
        req.user = null;
    }
    // If user is not admin, block access
    if (!req.user || !req.user.isAdmin) {
        return res
            .status(403)
            .render("pages/403", { message: "Admin access required." });
    }
    next();
};
