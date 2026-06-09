const axios = require("axios");
const crypto = require("crypto");
const ApiError = require("../utils/ApiError");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

// ─── Initialize Transaction ───────────────────────────
const initializeTransaction = async (email, amount, userId) => {
    const amountInKobo = Math.round(parseFloat(amount) * 100);

    const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
            email,
            amount: amountInKobo,
            metadata: { userId },
            callback_url: `${process.env.CLIENT_URL}/wallet/verify`,
        },
        {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.data.status) {
        throw new ApiError(400, "Failed to initialize Paystack transaction");
    }

    return response.data.data;
};

// ─── Verify Transaction ───────────────────────────────
const verifyTransaction = async (reference) => {
    const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET}`,
            },
        }
    );

    if (!response.data.status) {
        throw new ApiError(400, "Failed to verify Paystack transaction");
    }

    return response.data.data;
};

// ─── Verify Webhook Signature ─────────────────────────
const verifyWebhookSignature = (body, signature) => {
    const hash = crypto
        .createHmac("sha512", PAYSTACK_SECRET)
        .update(JSON.stringify(body))
        .digest("hex");

    return hash === signature;
};

module.exports = {
    initializeTransaction,
    verifyTransaction,
    verifyWebhookSignature,
};