const prisma = require("../config/db");
const walletService = require("../services/wallet.service");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// ─── Get All Users ────────────────────────────────────
const getUsersController = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    businessName: true,
                    isVerified: true,
                    isActive: true,
                    role: true,
                    createdAt: true,
                    wallet: {
                        select: { balance: true },
                    },
                },
            }),
            prisma.user.count(),
        ]);

        res.status(200).json(
            new ApiResponse(200, "Users fetched successfully", {
                users,
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

// ─── Get User By ID ───────────────────────────────────
const getUserByIdController = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                businessName: true,
                isVerified: true,
                isActive: true,
                role: true,
                createdAt: true,
                wallet: true,
                transactions: {
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
            },
        });

        if (!user) throw new ApiError(404, "User not found");

        res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
    } catch (error) {
        next(error);
    }
};

// ─── Toggle User Status ───────────────────────────────
const toggleUserStatusController = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.userId },
        });

        if (!user) throw new ApiError(404, "User not found");

        const updated = await prisma.user.update({
            where: { id: req.params.userId },
            data: { isActive: !user.isActive },
        });

        res.status(200).json(
            new ApiResponse(
                200,
                `User ${updated.isActive ? "activated" : "suspended"} successfully`,
                { isActive: updated.isActive }
            )
        );
    } catch (error) {
        next(error);
    }
};

// ─── Credit User Wallet ───────────────────────────────
const creditUserWalletController = async (req, res, next) => {
    try {
        const { amount, description } = req.body;

        if (!amount || parseFloat(amount) <= 0) {
            throw new ApiError(400, "Valid amount is required");
        }

        const transaction = await walletService.creditWallet(
            req.params.userId,
            amount,
            description || `Manual credit by admin`,
            null,
            null
        );

        res.status(200).json(
            new ApiResponse(200, "Wallet credited successfully", transaction)
        );
    } catch (error) {
        next(error);
    }
};

// ─── Debit User Wallet ────────────────────────────────
const debitUserWalletController = async (req, res, next) => {
    try {
        const { amount, description } = req.body;

        if (!amount || parseFloat(amount) <= 0) {
            throw new ApiError(400, "Valid amount is required");
        }

        const transaction = await walletService.debitWallet(
            req.params.userId,
            amount,
            description || `Manual debit by admin`
        );

        res.status(200).json(
            new ApiResponse(200, "Wallet debited successfully", transaction)
        );
    } catch (error) {
        next(error);
    }
};

// ─── Platform Stats ───────────────────────────────────
const getPlatformStatsController = async (req, res, next) => {
    try {
        const [totalUsers, totalMessages, totalRevenue] = await Promise.all([
            prisma.user.count(),
            prisma.message.count(),
            prisma.transaction.aggregate({
                where: { type: "CREDIT", status: "SUCCESS" },
                _sum: { amount: true },
            }),
        ]);

        res.status(200).json(
            new ApiResponse(200, "Stats fetched successfully", {
                totalUsers,
                totalMessages,
                totalRevenue: totalRevenue._sum.amount || 0,
            })
        );
    } catch (error) {
        next(error);
    }
};
const verifyUserController = async (req, res, next) => {
    try {
        const user = await prisma.user.update({
            where: { id: req.params.userId },
            data: { isVerified: true },
        });

        res.status(200).json(new ApiResponse(200, "User verified successfully", {
            isVerified: user.isVerified
        }));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsersController,
    getUserByIdController,
    toggleUserStatusController,
    creditUserWalletController,
    debitUserWalletController,
    getPlatformStatsController,
    verifyUserController,
};
const getPendingSenderIDsController = async (req, res, next) => {
    try {
        const senderIDs = await prisma.senderID.findMany({
            where: { status: "PENDING" },
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { firstName: true, lastName: true, email: true },
                },
            },
        });

        res.status(200).json(
            new ApiResponse(200, "Pending sender IDs fetched", senderIDs)
        );
    } catch (error) {
        next(error);
    }
};