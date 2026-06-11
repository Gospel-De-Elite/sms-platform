const express = require("express");
const router = express.Router();
const prisma = require("../config/db");
const { dispatchWebhook } = require("../services/webhook.service");

// ─── Termii Delivery Webhook ──────────────────────────
router.post("/termii", async (req, res) => {
    try {
        console.log("📬 Termii webhook received:", req.body);

        const { message_id, status } = req.body;

        if (!message_id) return res.status(200).json({ success: true });

        // Map Termii status to our status
        const messageStatus = status === "delivered" ? "DELIVERED"
            : status === "failed" ? "FAILED"
                : "SENT";

        const message = await prisma.message.findFirst({
            where: { gatewayRef: message_id },
        });

        if (message) {
            await prisma.message.update({
                where: { id: message.id },
                data: {
                    status: messageStatus,
                    deliveredAt: messageStatus === "DELIVERED" ? new Date() : null,
                },
            });

            // Update campaign stats if part of campaign
            if (message.campaignId) {
                if (messageStatus === "DELIVERED") {
                    await prisma.campaign.update({
                        where: { id: message.campaignId },
                        data: { totalDelivered: { increment: 1 } },
                    });
                } else if (messageStatus === "FAILED") {
                    await prisma.campaign.update({
                        where: { id: message.campaignId },
                        data: { totalFailed: { increment: 1 } },
                    });
                }
            }

            // Fire user webhook if configured
            await dispatchWebhook(
                message.userId,
                messageStatus === "DELIVERED" ? "sms.delivered" : "sms.failed",
                {
                    messageId: message.id,
                    recipient: message.recipient,
                    status: messageStatus,
                }
            );
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Termii webhook error:", error);
        res.status(200).json({ success: true });
    }
});

// ─── Multitexter Delivery Webhook ─────────────────────
router.post("/multitexter", async (req, res) => {
    try {
        console.log("📬 Multitexter webhook received:", req.body);

        const { messageid, status } = req.body;

        if (!messageid) return res.status(200).json({ success: true });

        const messageStatus = status === "delivered" ? "DELIVERED"
            : status === "failed" ? "FAILED"
                : "SENT";

        const message = await prisma.message.findFirst({
            where: { gatewayRef: messageid },
        });

        if (message) {
            await prisma.message.update({
                where: { id: message.id },
                data: {
                    status: messageStatus,
                    deliveredAt: messageStatus === "DELIVERED" ? new Date() : null,
                },
            });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Multitexter webhook error:", error);
        res.status(200).json({ success: true });
    }
});

module.exports = router;