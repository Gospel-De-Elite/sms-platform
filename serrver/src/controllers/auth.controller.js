const authService = require("../services/auth.service");
const ApiResponse = require("../utils/ApiResponse");

const registerController = async (req, res, next) => {
    try {
        const data = await authService.register(req.body);
        res.status(201).json(
            new ApiResponse(201, "Registration successful. Please verify your email.", data)
        );
    } catch (error) {
        next(error);
    }
};

const verifyEmailController = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const data = await authService.verifyEmail(email, otp);
        res.status(200).json(new ApiResponse(200, data.message));
    } catch (error) {
        next(error);
    }
};

const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await authService.login(email, password);
        res.status(200).json(new ApiResponse(200, "Login successful", data));
    } catch (error) {
        next(error);
    }
};

const forgotPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body;
        const data = await authService.forgotPassword(email);
        res.status(200).json(new ApiResponse(200, data.message));
    } catch (error) {
        next(error);
    }
};
const logoutController = async (req, res, next) => {
    try {
        res.status(200).json(new ApiResponse(200, "Logged out successfully"));
    } catch (error) {
        next(error);
    }
};

const resetPasswordController = async (req, res, next) => {
    try {
        const { email, otp, password } = req.body;
        const data = await authService.resetPassword(email, otp, password);
        res.status(200).json(new ApiResponse(200, data.message));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerController,
    verifyEmailController,
    loginController,
    forgotPasswordController,
    resetPasswordController,
    logoutController,
};