// middlewares/commonData.js
const Category = require("../models/Category");
const General = require("../models/General");
// …import any other models you need (Poll, Item, Gallery)…

module.exports = async function commonData(req, res, next) {
    try {
        // 1. Categories for the “Items” dropdown
        const categories = await Category.find().lean();

        // 2. Party Props category (if it exists)
        const propsCategory = await Category.findOne({
            name: /partyprops/i,
        }).lean();

        // 3. General info (for footer & analytics/map)
        const generalDoc = await General.findOne().lean();
        const analytics = generalDoc?.analytics || {};
        const mapUrl = generalDoc?.mapEmbedUrl || "";

        // Expose to all templates:
        res.locals.categories = categories;
        res.locals.propsCategory = propsCategory; // or just propsCategory._id if you like
        res.locals.general = generalDoc;
        res.locals.analytics = analytics;
        res.locals.mapUrl = mapUrl;

        next();
    } catch (err) {
        next(err);
    }
};
