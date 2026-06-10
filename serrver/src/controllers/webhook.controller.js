const prisma = require("../config/db");
const crypto = require("crypto");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const createWebhookController = async (req, res, next) => {
    try {
        const { url, events } = req.body;

        if (!url || !events || !Array.isArray(events) || events.length === 0) {
            return next(new ApiError(400, "url and events array are required"));
        }

        const validEvents = ["sms.delivered", "sms.failed", "campaign.completed"];
        const invalidEvents = events.filter((e) => !validEvents.includes(e));
        if (invalidEvents.length > 0) {
            return next(new ApiError(400, `Invalid events: ${invalidEvents.join(", ")}`));
        }

        const secret = crypto.randomBytes(32).toString("hex");

        const webhook = await prisma.webhook.create({
            data: {
                userId: req.user.id,
                url,
                events,
                secret,
            },
        });

        res.status(201).json(
            new ApiResponse(201, "Webhook created successfully", {
                ...webhook,
                secret,
            })
        );
    } catch (error) {
        next(error);
    }
};

const getWebhooksController = async (req, res, next) => {
    try {
        const webhooks = await prisma.webhook.findMany({
            where: { userId: req.user.id },
            select: {
                id: true,
                url: true,
                events: true,
                isActive: true,
                createdAt: true,
            },
        });

        res.status(200).json(new ApiResponse(200, "Webhooks fetched", webhooks));
    } catch (error) {
        next(error);
    }
};

const deleteWebhookController = async (req, res, next) => {
    try {
        const webhook = await prisma.webhook.findFirst({
            where: { id: req.params.webhookId, userId: req.user.id },
        });

        if (!webhook) throw new ApiError(404, "Webhook not found");

        await prisma.webhook.delete({ where: { id: req.params.webhookId } });
        res.status(200).json(new ApiResponse(200, "Webhook deleted"));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createWebhookController,
    getWebhooksController,
    deleteWebhookController,
};