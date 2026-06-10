const express = require("express");
const router = express.Router();
const { authenticateApiKey } = require("../middlewares/apiKey.middleware");
const { sendSingleSMS } = require("../services/sms.service");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const prisma = require("../config/db");

// ─── Send SMS via API ─────────────────────────────────
router.post("/sms/send", authenticateApiKey, async (req, res, next) => {
    try {
        const { to, sender, message } = req.body;

        if (!to || !sender || !message) {
            return next(new ApiError(400, "to, sender and message are required"));
        }

        // Find sender ID by name
        const senderID = await prisma.senderID.findFirst({
            where: {
                userId: req.user.id,
                name: sender,
                status: "APPROVED",
            },
        });

        if (!senderID) {
            return next(new ApiError(400, "Sender ID not found or not approved"));
        }

        const result = await sendSingleSMS(req.user.id, {
            to,
            senderIDId: senderID.id,
            message,
        });

        res.status(200).json(
            new ApiResponse(200, "SMS sent successfully", {
                messageId: result.id,
                status: result.status,
                recipient: result.recipient,
                units: result.units,
                cost: result.cost,
            })
        );
    } catch (error) {
        next(error);
    }
});

// ─── Check Balance via API ────────────────────────────
router.get("/balance", authenticateApiKey, async (req, res, next) => {
    try {
        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user.id },
        });

        res.status(200).json(
            new ApiResponse(200, "Balance fetched", {
                balance: wallet?.balance || 0,
                currency: "NGN",
            })
        );
    } catch (error) {
        next(error);
    }
});

// ─── Get Message Status via API ───────────────────────
router.get("/sms/:messageId", authenticateApiKey, async (req, res, next) => {
    try {
        const message = await prisma.message.findFirst({
            where: {
                id: req.params.messageId,
                userId: req.user.id,
            },
        });

        if (!message) return next(new ApiError(404, "Message not found"));

        res.status(200).json(
            new ApiResponse(200, "Message fetched", {
                messageId: message.id,
                recipient: message.recipient,
                status: message.status,
                units: message.units,
                cost: message.cost,
                createdAt: message.createdAt,
            })
        );
    } catch (error) {
        next(error);
    }
});

module.exports = router;