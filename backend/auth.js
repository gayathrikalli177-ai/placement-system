const jwt = require("jsonwebtoken");

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET must be set to a random value of at least 32 characters.");
    }

    return secret;
}

function createAccessToken({ id, role, email }) {
    return jwt.sign(
        { sub: String(id), role, email },
        getJwtSecret(),
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
}

module.exports = { createAccessToken, getJwtSecret };
