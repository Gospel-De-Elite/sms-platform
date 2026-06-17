const axios = require("axios");
const crypto = require("crypto");
const ApiError = require("../utils/ApiError");

const MONNIFY_BASE_URL = process.env.MONNIFY_BASE_URL || "https://sandbox.monnify.com";
const MONNIFY_API_KEY = process.env.MONNIFY_API_KEY;
const MONNIFY_SECRET = process.env.MONNIFY_SECRET_KEY;
const MONNIFY_CONTRACT = process.env.MONNIFY_CONTRACT_CODE;

// ─── Get Access Token ─────────────────────────────────
const getAccessToken = async () => {
    const credentials = Buffer.from(`${MONNIFY_API_KEY}:${MONNIFY_SECRET}`).toString("base64");

    const response = await axios.post(
        `${MONNIFY_BASE_URL}/api/v1/auth/login`,
        {},
        {
            headers: {
                Authorization: `Basic ${credentials}`,
            },
        }
    );

    return response.data.responseBody.accessToken;
};

// ─── Initialize Transaction ───────────────────────────
const initializeTransaction = async (email, amount, userId, name) => {
    const accessToken = await getAccessToken();
    const reference = `SMS_${Date.now()}_${userId.slice(0, 8)}`;

    const response = await axios.post(
        `${MONNIFY_BASE_URL}/api/v1/merchant/transactions/init-transaction`,
        {
            amount: parseFloat(amount),
            customerName: name,
            customerEmail: email,
            paymentReference: reference,
            paymentDescription: "Wallet Top-up",
            currencyCode: "NGN",
            contractCode: MONNIFY_CONTRACT,
            redirectUrl: `${process.env.CLIENT_URL}/wallet/verify`,
            paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.data.requestSuccessful) {
        throw new ApiError(400, "Failed to initialize Monnify transaction");
    }

    return response.data.responseBody;
};

// ─── Verify Webhook Signature ─────────────────────────
const verifyWebhookSignature = (body, signature) => {
    const hash = crypto
        .createHmac("sha512", MONNIFY_SECRET)
        .update(JSON.stringify(body))
        .digest("hex");

    return hash === signature;
};

module.exports = {
    initializeTransaction,
    verifyWebhookSignature,
};