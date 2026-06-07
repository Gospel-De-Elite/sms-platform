const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate.middleware");
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} = require("../validators/auth.validator");
const {
    registerController,
    verifyEmailController,
    loginController,
    forgotPasswordController,
    resetPasswordController,
} = require("../controllers/auth.controller");

router.post("/register", validate(registerSchema), registerController);
router.post("/verify-email", verifyEmailController);
router.post("/login", validate(loginSchema), loginController);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPasswordController);
router.post("/reset-password", validate(resetPasswordSchema), resetPasswordController);

module.exports = router;