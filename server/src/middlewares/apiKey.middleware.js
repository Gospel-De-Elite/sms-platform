const { validateApiKey } = require("../services/apiKey.service");
const ApiError = require("../utils/ApiError");
const prisma = require("../config/db");

const authenticateApiKey = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new ApiError(401, "API key required"));
        }

        const rawKey = authHeader.split(" ")[1];

        if (!rawKey.startsWith("sms_")) {
            return next(new ApiError(401, "Invalid API key format"));
        }

        const apiKey = await validateApiKey(rawKey);

        // Log API usage
        await prisma.apiLog.create({
            data: {
                userId: apiKey.user.id,
                apiKeyId: apiKey.id,
                endpoint: req.path,
                method: req.method,
                statusCode: 200,
                ipAddress: req.ip || "unknown",
            },
        });

        req.user = apiKey.user;
        req.apiKey = apiKey;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { authenticateApiKey };