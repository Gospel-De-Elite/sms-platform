const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");
const {
    createSenderIDController,
    getSenderIDsController,
    deleteSenderIDController,
    approveSenderIDController,
    rejectSenderIDController,
} = require("../controllers/senderID.controller");

router.post("/", protect, createSenderIDController);
router.get("/", protect, getSenderIDsController);
router.delete("/:senderIDId", protect, deleteSenderIDController);

// Admin only
router.put("/:senderIDId/approve", protect, adminOnly, approveSenderIDController);
router.put("/:senderIDId/reject", protect, adminOnly, rejectSenderIDController);

module.exports = router;