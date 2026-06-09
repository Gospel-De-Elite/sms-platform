const walletService = require("../services/wallet.service");
const paystackService = require("../services/paystack.service");
const monnifyService = require("../services/monnify.service");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const prisma = require("../config/db");

// ─── Get Wallet Balance ───────────────────────────────
const getWalletController = async (req, res, next) => {
    try {
        const wallet = await walletService.getWallet(req.user.id);
        res.status(200).json(new ApiResponse(200, "Wallet fetched successfully", wallet));
    } catch (error) {
        next(error);
    }
};

// ─── Initialize Paystack Payment ──────────────────────
const initializePaystackController = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount || parseFloat(amount) < 100) {
            return next(new ApiError(400, "Minimum amount is ₦100"));
        }

        const data = await paystackService.initializeTransaction(
            req.user.email,
            amount,
            req.user.id
        );

        res.status(200).json(new ApiResponse(200, "Payment initialized", data));
    } catch (error) {
        next(error);
    }
};

// ─── Initialize Monnify Payment ───────────────────────
const initializeMonnifyController = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount || parseFloat(amount) < 100) {
            return next(new ApiError(400, "Minimum amount is ₦100"));
        }

        const fullName = `${req.user.firstName} ${req.user.lastName}`;

        const data = await monnifyService.initializeTransaction(
            req.user.email,
            amount,
            req.user.id,
            fullName
        );

        res.status(200).json(new ApiResponse(200, "Payment initialized", data));
    } catch (error) {
        next(error);
    }
};

// ─── Paystack Webhook ─────────────────────────────────
const paystackWebhookController = async (req, res, next) => {
    try {
        const signature = req.headers["x-paystack-signature"];

        if (!paystackService.verifyWebhookSignature(req.body, signature)) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        const event = req.body;

        if (event.event === "charge.success") {
            const { reference, amount, metadata } = event.data;
            const userId = metadata?.userId;

            if (!userId) return res.status(200).json({ message: "No userId in metadata" });

            // Check if transaction already processed
            const existing = await prisma.transaction.findFirst({
                where: { gatewayRef: reference },
            });

            if (existing) return res.status(200).json({ message: "Already processed" });

            // Credit wallet — convert from kobo to naira
            const amountInNaira = amount / 100;
            await walletService.creditWallet(
                userId,
                amountInNaira,
                "Wallet top-up via Paystack",
                "PAYSTACK",
                reference
            );
        }

        res.status(200).json({ message: "Webhook received" });
    } catch (error) {
        next(error);
    }
};

// ─── Monnify Webhook ──────────────────────────────────
const monnifyWebhookController = async (req, res, next) => {
    try {
        const signature = req.headers["monnify-signature"];

        if (!monnifyService.verifyWebhookSignature(req.body, signature)) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        const event = req.body;

        if (event.eventType === "SUCCESSFUL_TRANSACTION") {
            const { paymentReference, amountPaid, customer } = event.eventData;

            // Check if already processed
            const existing = await prisma.transaction.findFirst({
                where: { gatewayRef: paymentReference },
            });

            if (existing) return res.status(200).json({ message: "Already processed" });

            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email: customer.email },
            });

            if (!user) return res.status(200).json({ message: "User not found" });

            await walletService.creditWallet(
                user.id,
                amountPaid,
                "Wallet top-up via Monnify",
                "MONNIFY",
                paymentReference
            );
        }

        res.status(200).json({ message: "Webhook received" });
    } catch (error) {
        next(error);
    }
};

// ─── Verify Paystack Payment (frontend callback) ──────
const verifyPaystackController = async (req, res, next) => {
    try {
        const { reference } = req.query;
        if (!reference) return next(new ApiError(400, "Reference is required"));

        const data = await paystackService.verifyTransaction(reference);

        if (data.status === "success") {
            // Check if already processed
            const existing = await prisma.transaction.findFirst({
                where: { gatewayRef: reference },
            });

            if (!existing) {
                const amountInNaira = data.amount / 100;
                await walletService.creditWallet(
                    req.user.id,
                    amountInNaira,
                    "Wallet top-up via Paystack",
                    "PAYSTACK",
                    reference
                );
            }

            res.status(200).json(new ApiResponse(200, "Payment successful"));
        } else {
            return next(new ApiError(400, "Payment not successful"));
        }
    } catch (error) {
        next(error);
    }
};

// ─── Get Transaction History ──────────────────────────
const getTransactionsController = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const data = await walletService.getTransactions(req.user.id, page, limit);
        res.status(200).json(new ApiResponse(200, "Transactions fetched successfully", data));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getWalletController,
    initializePaystackController,
    initializeMonnifyController,
    paystackWebhookController,
    monnifyWebhookController,
    verifyPaystackController,
    getTransactionsController,
};