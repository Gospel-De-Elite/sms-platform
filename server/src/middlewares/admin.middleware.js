const ApiError = require("../utils/ApiError");

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "ADMIN") {
        return next();
    }
    return next(new ApiError(403, "Access denied. Admins only"));
};

module.exports = { adminOnly };