const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../auth");

const validRoles = new Set(["student", "company", "admin"]);

function authenticate(req, res, next) {
    const authorization = req.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authentication is required" });
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
        return res.status(401).json({ message: "Authentication is required" });
    }

    try {
        const payload = jwt.verify(token, getJwtSecret());
        const userId = Number(payload.sub);

        if (!Number.isSafeInteger(userId) || !validRoles.has(payload.role)) {
            return res.status(401).json({ message: "Invalid access token" });
        }

        req.auth = { userId, role: payload.role, email: payload.email };
        return next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Invalid or expired access token" });
        }

        return next(error);
    }
}

function authorize(...roles) {
    return (req, res, next) => {
        if (!req.auth || !roles.includes(req.auth.role)) {
            return res.status(403).json({ message: "You do not have permission to perform this action" });
        }

        return next();
    };
}

module.exports = { authenticate, authorize };
