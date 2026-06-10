const axios = require("axios");
const crypto = require("crypto");
const prisma = require("../config/db");

const dispatchWebhook = async (userId, event, data) => {
    const webhooks = await prisma.webhook.findMany({
        where: {
            userId,
            isActive: true,
            events: { has: event },
        },
    });

    for (const webhook of webhooks) {
        const payload = {
            event,
            data,
            timestamp: new Date().toISOString(),
        };

        // Sign the payload
        const signature = crypto
            .createHmac("sha256", webhook.secret)
            .update(JSON.stringify(payload))
            .digest("hex");

        try {
            await axios.post(webhook.url, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "X-SMSPro-Signature": signature,
                    "X-SMSPro-Event": event,
                },
                timeout: 5000,
            });
        } catch (error) {
            console.error(`Webhook delivery failed to ${webhook.url}:`, error.message);
        }
    }
};

module.exports = { dispatchWebhook };