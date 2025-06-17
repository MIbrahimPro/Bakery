// middlewares/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload dirs exist
const ensureDir = (folder) => {
    const dir = path.join(__dirname, "../uploads", folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
};

// Create a storage engine for a given folder
const createStorage = (folder) =>
    new multer.diskStorage({
        destination: (req, file, cb) => cb(null, ensureDir(folder)),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
        },
    });

// Filter for images
const imageFileFilter = (req, file, cb) => {
    const allowed = /\.(jpe?g|png|gif)$/i;
    if (allowed.test(file.originalname)) cb(null, true);
    else cb(new Error("Only image files are allowed!"), false);
};

// Filter for videos (mp4, mov, etc)
const videoFileFilter = (req, file, cb) => {
    const allowed = /\.(mp4|mov|avi|mkv)$/i;
    if (allowed.test(file.originalname)) cb(null, true);
    else cb(new Error("Only video files are allowed!"), false);
};

// Exported upload handlers:
module.exports = {
    uploadCategoryImage: multer({
        storage: createStorage("categories"),
        fileFilter: imageFileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    }).single("image"),

    uploadItemImage: multer({
        storage: createStorage("items"),
        fileFilter: imageFileFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    }).single("image"),

    uploadGalleryImage: multer({
        storage: createStorage("gallery"),
        fileFilter: imageFileFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    }).single("image"),

    uploadStaffImage: multer({
        storage: createStorage("staff"),
        fileFilter: imageFileFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    }).single("image"),

    uploadCookingVideo: multer({
        storage: createStorage("cooking"),
        fileFilter: videoFileFilter,
        limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    }).single("video"),
};
