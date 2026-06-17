const prisma = require("../config/db");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const createSenderIDController = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) return next(new ApiError(400, "Sender ID name is required"));
        if (name.length > 11) return next(new ApiError(400, "Sender ID cannot exceed 11 characters"));

        const senderID = await prisma.senderID.create({
            data: { userId: req.user.id, name },
        });

        res.status(201).json(new ApiResponse(201, "Sender ID submitted for approval", senderID));
    } catch (error) {
        next(error);
    }
};

const getSenderIDsController = async (req, res, next) => {
    try {
        const senderIDs = await prisma.senderID.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: "desc" },
        });

        res.status(200).json(new ApiResponse(200, "Sender IDs fetched successfully", senderIDs));
    } catch (error) {
        next(error);
    }
};

const deleteSenderIDController = async (req, res, next) => {
    try {
        const senderID = await prisma.senderID.findFirst({
            where: { id: req.params.senderIDId, userId: req.user.id },
        });

        if (!senderID) throw new ApiError(404, "Sender ID not found");
        if (senderID.status === "APPROVED") {
            throw new ApiError(400, "Cannot delete an approved Sender ID");
        }

        await prisma.senderID.delete({ where: { id: req.params.senderIDId } });
        res.status(200).json(new ApiResponse(200, "Sender ID deleted successfully"));
    } catch (error) {
        next(error);
    }
};

// Admin actions
const approveSenderIDController = async (req, res, next) => {
    try {
        const senderID = await prisma.senderID.update({
            where: { id: req.params.senderIDId },
            data: { status: "APPROVED" },
        });

        res.status(200).json(new ApiResponse(200, "Sender ID approved", senderID));
    } catch (error) {
        next(error);
    }
};

const rejectSenderIDController = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const senderID = await prisma.senderID.update({
            where: { id: req.params.senderIDId },
            data: { status: "REJECTED", rejectionReason: reason },
        });

        res.status(200).json(new ApiResponse(200, "Sender ID rejected", senderID));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSenderIDController,
    getSenderIDsController,
    deleteSenderIDController,
    approveSenderIDController,
    rejectSenderIDController,
};