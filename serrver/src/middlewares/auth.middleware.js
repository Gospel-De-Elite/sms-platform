const jwt = require("jsonwebtoken");
const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");

const protect = async (req, res, next) => {
    try {
        // Check for token in headers
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new ApiError(401, "Access denied. No token provided"));
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check user still exists and is active
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isActive: true,
                isVerified: true,
            },
        });

        if (!user) {
            return next(new ApiError(401, "User no longer exists"));
        }

        if (!user.isActive) {
            return next(new ApiError(403, "Your account has been suspended"));
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { protect };