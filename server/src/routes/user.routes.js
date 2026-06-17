const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
    getProfileController,
    updateProfileController,
    changePasswordController,
} = require("../controllers/user.controller");

router.get("/profile", protect, getProfileController);
router.put("/profile", protect, updateProfileController);
router.put("/change-password", protect, changePasswordController);

module.exports = router;