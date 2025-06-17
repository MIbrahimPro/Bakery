// models/Config.js
const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

const configSchema = new mongoose.Schema(
    {
        instagramLink: { type: String },
        facebookLink: { type: String },
        youtubeLink: { type: String },
        contactNumber: { type: String },
        contactEmail: { type: String },
        faq: [faqSchema],
        analytics: {
            yearsOfOperation: { type: Number, default: 0 },
            employeesCount: { type: Number, default: 0 },
            bakedKilograms: { type: Number, default: 0 },
            destinationsCount: { type: Number, default: 0 }, // or an array: [String]
        },
        mapEmbedUrl: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Config", configSchema);
