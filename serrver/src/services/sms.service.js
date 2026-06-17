const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");
const { debitWallet } = require("./wallet.service");
const TermiiAdapter = require("../gateways/termii.adapter");
const MultitexterAdapter = require("../gateways/multitexter.adapter");

// ─── Gateway Selection ────────────────────────────────
const getGateway = (gatewayName = "TERMII") => {
    switch (gatewayName.toUpperCase()) {
        case "TERMII":
            return new TermiiAdapter();
        case "MULTITEXTER":
            return new MultitexterAdapter();
        default:
            return new TermiiAdapter();
    }
};

// ─── Calculate SMS Units ──────────────────────────────
// Standard SMS is 160 chars, unicode is 70 chars
const calculateUnits = (message) => {
    const length = message.length;
    if (length <= 160) return 1;
    return Math.ceil(length / 153);
};

// ─── Calculate Cost ───────────────────────────────────
// Cost per unit in Naira — configurable
const COST_PER_UNIT = parseFloat(process.env.SMS_COST_PER_UNIT || "4");

const calculateCost = (units) => units * COST_PER_UNIT;

// ─── Send Single SMS ──────────────────────────────────
const sendSingleSMS = async (userId, { to, senderIDId, message }) => {
    console.log("📨 SMS Send Attempt:", { userId, to, senderIDId });

    const senderID = await prisma.senderID.findFirst({
        where: { id: senderIDId, userId, status: "APPROVED" },
    });

    if (!senderID) {
        console.log("❌ Sender ID not found or not approved");
        throw new ApiError(400, "Invalid or unapproved sender ID");
    }

    console.log("✅ Sender ID found:", senderID.name);

    const units = calculateUnits(message);
    const cost = calculateCost(units);

    console.log("💰 Cost calculation:", { units, cost });

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    console.log("👛 Wallet balance:", wallet?.balance);

    if (!wallet || parseFloat(wallet.balance) < cost) {
        console.log("❌ Insufficient balance");
        throw new ApiError(400, "Insufficient wallet balance");
    }

    const gateway = getGateway(process.env.PRIMARY_SMS_GATEWAY || "TERMII");
    console.log("🔌 Using gateway:", process.env.PRIMARY_SMS_GATEWAY || "TERMII");

    let gatewayRef = null;
    let status = "FAILED";
    let failureReason = null;

    try {
        console.log("📤 Sending via primary gateway...");
        const result = await gateway.sendSingle(to, senderID.name, message);
        gatewayRef = result.gatewayRef;
        status = "SENT";
        console.log("✅ Primary gateway success:", result);
    } catch (error) {
        console.log("❌ Primary gateway failed:", error.message);
        console.log("❌ Gateway error details:", error.response?.data);

        try {
            console.log("📤 Trying fallback gateway (Multitexter)...");
            const fallback = getGateway("MULTITEXTER");
            const result = await fallback.sendSingle(to, senderID.name, message);
            gatewayRef = result.gatewayRef;
            status = "SENT";
            console.log("✅ Fallback gateway success:", result);
        } catch (fallbackError) {
            console.log("❌ Fallback gateway also failed:", fallbackError.message);
            console.log("❌ Fallback error details:", fallbackError.response?.data);
            failureReason = `Primary: ${error.message} | Fallback: ${fallbackError.message}`;
            status = "FAILED";
        }
    }

    const msg = await prisma.message.create({
        data: {
            userId,
            senderIDId,
            recipient: to,
            message,
            units,
            cost,
            status,
            gatewayUsed: process.env.PRIMARY_SMS_GATEWAY || "TERMII",
            gatewayRef,
            failureReason,
        },
    });

    console.log("💾 Message recorded:", { id: msg.id, status: msg.status, failureReason: msg.failureReason });

    if (status === "SENT") {
        await debitWallet(userId, cost, `SMS to ${to}`);
        console.log("✅ Wallet debited:", cost);
    }

    return msg;
};
// ─── Send Bulk SMS ────────────────────────────────────
const sendBulkSMS = async (userId, { recipients, senderIDId, message, campaignName }) => {
    const senderID = await prisma.senderID.findFirst({
        where: { id: senderIDId, userId, status: "APPROVED" },
    });
    if (!senderID) throw new ApiError(400, "Invalid or unapproved sender ID");

    const units = calculateUnits(message);
    const costPerMessage = calculateCost(units);
    const totalCost = costPerMessage * recipients.length;

    // Check wallet balance
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || parseFloat(wallet.balance) < totalCost) {
        throw new ApiError(400, `Insufficient balance. Need ₦${totalCost}, have ₦${wallet?.balance || 0}`);
    }

    // Create campaign
    const campaign = await prisma.campaign.create({
        data: {
            userId,
            senderIDId,
            name: campaignName || `Campaign ${Date.now()}`,
            message,
            totalRecipients: recipients.length,
            totalCost,
            status: "QUEUED",
        },
    });

    return campaign;
};

// ─── Process Campaign (called by queue worker) ────────
const processCampaign = async (campaignId, recipients) => {
    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { senderID: true },
    });

    if (!campaign) throw new ApiError(404, "Campaign not found");

    await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: "SENDING" },
    });

    const gateway = getGateway(process.env.PRIMARY_SMS_GATEWAY || "TERMII");
    const units = calculateUnits(campaign.message);
    const costPerMessage = calculateCost(units);

    let totalSent = 0;
    let totalDelivered = 0;
    let totalFailed = 0;

    // Process in batches of 100
    const batchSize = 100;
    for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);

        try {
            const results = await gateway.sendBulk(
                batch.map((r) => ({ to: r })),
                campaign.senderID.name,
                campaign.message
            );

            // Record each message
            await prisma.message.createMany({
                data: results.map((result) => ({
                    userId: campaign.userId,
                    campaignId,
                    senderIDId: campaign.senderIDId,
                    recipient: result.to,
                    message: campaign.message,
                    units,
                    cost: costPerMessage,
                    status: result.status === "SENT" ? "SENT" : "FAILED",
                    gatewayUsed: process.env.PRIMARY_SMS_GATEWAY || "TERMII",
                    gatewayRef: result.gatewayRef,
                })),
            });

            totalSent += results.filter((r) => r.status === "SENT").length;
            totalFailed += results.filter((r) => r.status !== "SENT").length;
        } catch (error) {
            totalFailed += batch.length;
        }
    }

    // Debit wallet for sent messages
    const amountToDebit = totalSent * costPerMessage;
    if (amountToDebit > 0) {
        await debitWallet(
            campaign.userId,
            amountToDebit,
            `Bulk SMS campaign: ${campaign.name}`
        );
    }

    // Update campaign status
    await prisma.campaign.update({
        where: { id: campaignId },
        data: {
            status: "COMPLETED",
            totalSent,
            totalDelivered,
            totalFailed,
            completedAt: new Date(),
        },
    });
};
// Only debit if actually sent
module.exports = { sendSingleSMS, sendBulkSMS, processCampaign, calculateUnits, calculateCost };