const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Access token required."
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            success: false,
            error: "Invalid or expired token."
        });

    }
}

function requireAdmin(req, res, next) {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: "Authentication required."
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            error: "Admin access required."
        });
    }

    next();
}

module.exports = {
    authenticateToken,
    requireAdmin
};