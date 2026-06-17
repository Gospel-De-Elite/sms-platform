const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
    getWalletController,
    initializePaystackController,
    initializeMonnifyController,
    paystackWebhookController,
    monnifyWebhookController,
    verifyPaystackController,
    getTransactionsController,
} = require("../controllers/wallet.controller");

// Protected routes
router.get("/", protect, getWalletController);
router.post("/fund/paystack", protect, initializePaystackController);
router.post("/fund/monnify", protect, initializeMonnifyController);
router.get("/verify/paystack", protect, verifyPaystackController);
router.get("/transactions", protect, getTransactionsController);

// Webhook routes — no auth, verified by signature
router.post("/webhook/paystack", paystackWebhookController);
router.post("/webhook/monnify", monnifyWebhookController);

module.exports = router;