const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const resumeDirectory = path.join(__dirname, "..", "uploads", "resumes");
const avatarDirectory = path.join(__dirname, "..", "uploads", "avatars");

fs.mkdirSync(resumeDirectory, { recursive: true });
fs.mkdirSync(avatarDirectory, { recursive: true });

const resumeStorage = multer.diskStorage({
    destination: resumeDirectory,
    filename: (req, file, callback) => callback(null, `${crypto.randomUUID()}.pdf`)
});

const avatarStorage = multer.diskStorage({
    destination: avatarDirectory,
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
        callback(null, `avatar_${crypto.randomUUID()}${ext}`);
    }
});

const uploadResume = multer({
    storage: resumeStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (file.mimetype !== "application/pdf") return callback(new Error("Only PDF resumes are allowed"));
        return callback(null, true);
    }
}).single("resume");

const uploadAvatar = multer({
    storage: avatarStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith("image/")) {
            return callback(new Error("Only image files (JPG, PNG, WEBP) are allowed for profile picture"));
        }
        return callback(null, true);
    }
}).single("avatar");

module.exports = { uploadResume, uploadAvatar };
