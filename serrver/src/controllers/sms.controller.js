const smsService = require("../services/sms.service");
const smsQueue = require("../queues/sms.queue");
const prisma = require("../config/db");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// ─── Send Single SMS ──────────────────────────────────
const sendSingleController = async (req, res, next) => {
    try {
        const { to, senderIDId, message } = req.body;

        if (!to || !senderIDId || !message) {
            return next(new ApiError(400, "to, senderIDId and message are required"));
        }

        const result = await smsService.sendSingleSMS(req.user.id, {
            to,
            senderIDId,
            message,
        });

        res.status(200).json(new ApiResponse(200, "SMS sent successfully", result));
    } catch (error) {
        next(error);
    }
};

// ─── Send Bulk SMS ────────────────────────────────────
const sendBulkController = async (req, res, next) => {
    try {
        const { recipients, senderIDId, message, campaignName } = req.body;

        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return next(new ApiError(400, "recipients must be a non-empty array"));
        }

        if (!senderIDId || !message) {
            return next(new ApiError(400, "senderIDId and message are required"));
        }

        // Create campaign
        const campaign = await smsService.sendBulkSMS(req.user.id, {
            recipients,
            senderIDId,
            message,
            campaignName,
        });

        // Add to queue
        await smsQueue.add({
            campaignId: campaign.id,
            recipients,
        });

        res.status(200).json(
            new ApiResponse(200, "Bulk SMS queued successfully", campaign)
        );
    } catch (error) {
        next(error);
    }
};

// ─── Get Campaigns ────────────────────────────────────
const getCampaignsController = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [campaigns, total] = await Promise.all([
            prisma.campaign.findMany({
                where: { userId: req.user.id },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
                include: { senderID: true },
            }),
            prisma.campaign.count({ where: { userId: req.user.id } }),
        ]);

        res.status(200).json(
            new ApiResponse(200, "Campaigns fetched successfully", {
                campaigns,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            })
        );
    } catch (error) {
        next(error);
    }
};

// ─── Get Campaign Messages ────────────────────────────
const getCampaignMessagesController = async (req, res, next) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                campaignId: req.params.campaignId,
                userId: req.user.id,
            },
            orderBy: { createdAt: "desc" },
        });

        res.status(200).json(
            new ApiResponse(200, "Messages fetched successfully", messages)
        );
    } catch (error) {
        next(error);
    }
};

// ─── Get Message History ──────────────────────────────
const getMessagesController = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [messages, total] = await Promise.all([
            prisma.message.findMany({
                where: { userId: req.user.id },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
                include: { senderID: true },
            }),
            prisma.message.count({ where: { userId: req.user.id } }),
        ]);

        res.status(200).json(
            new ApiResponse(200, "Messages fetched successfully", {
                messages,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            })
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendSingleController,
    sendBulkController,
    getCampaignsController,
    getCampaignMessagesController,
    getMessagesController,
};