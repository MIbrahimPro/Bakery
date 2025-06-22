module.exports.cartContextMiddleware = (req, res, next) => {
    if (!req.session) req.session = {};
    if (!req.session.cart) req.session.cart = { items: [] };
    req.cart = req.session.cart;
    next();
};
