const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");
const {
    getUsersController,
    getUserByIdController,
    toggleUserStatusController,
    creditUserWalletController,
    debitUserWalletController,
    getPlatformStatsController,
    verifyUserController,
} = require("../controllers/admin.controller");

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get("/users", getUsersController);
router.get("/users/:userId", getUserByIdController);
router.put("/users/:userId/toggle-status", toggleUserStatusController);
router.post("/users/:userId/wallet/credit", creditUserWalletController);
router.post("/users/:userId/wallet/debit", debitUserWalletController);
router.get("/stats", getPlatformStatsController);
router.put("/users/:userId/verify", verifyUserController);
module.exports = router;