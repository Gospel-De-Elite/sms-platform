const userService = require("../services/user.service");
const ApiResponse = require("../utils/ApiResponse");
const validate = require("../middlewares/validate.middleware");
const { updateProfileSchema, changePasswordSchema } = require("../validators/user.validator");

const getProfileController = async (req, res, next) => {
    try {
        const data = await userService.getProfile(req.user.id);
        res.status(200).json(new ApiResponse(200, "Profile fetched successfully", data));
    } catch (error) {
        next(error);
    }
};

const updateProfileController = async (req, res, next) => {
    try {
        const result = updateProfileSchema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error?.errors?.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            })) || [];
            return res.status(400).json({ success: false, message: "Validation failed", errors });
        }

        const data = await userService.updateProfile(req.user.id, result.data);
        res.status(200).json(new ApiResponse(200, "Profile updated successfully", data));
    } catch (error) {
        next(error);
    }
};

const changePasswordController = async (req, res, next) => {
    try {
        const result = changePasswordSchema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error?.errors?.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            })) || [];
            return res.status(400).json({ success: false, message: "Validation failed", errors });
        }

        const { currentPassword, newPassword } = result.data;
        const data = await userService.changePassword(req.user.id, currentPassword, newPassword);
        res.status(200).json(new ApiResponse(200, data.message));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfileController,
    updateProfileController,
    changePasswordController,
};