const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");

// ─── Get Profile ──────────────────────────────────────
const getProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            businessName: true,
            isVerified: true,
            twoFactorEnabled: true,
            role: true,
            createdAt: true,
            wallet: {
                select: {
                    balance: true,
                    totalFunded: true,
                    totalSpent: true,
                },
            },
        },
    });

    if (!user) throw new ApiError(404, "User not found");
    return user;
};

// ─── Update Profile ───────────────────────────────────
const updateProfile = async (userId, data) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            businessName: true,
        },
    });

    return user;
};

// ─── Change Password ──────────────────────────────────
const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new ApiError(400, "Current password is incorrect");

    const hashed = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
    });

    return { message: "Password changed successfully" };
};

module.exports = { getProfile, updateProfile, changePassword };