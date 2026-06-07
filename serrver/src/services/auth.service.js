const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const { generateOTP } = require("../utils/generateOTP");
const { sendVerificationEmail, sendPasswordResetEmail } = require("./mail.service");
const dayjs = require("dayjs");

// ─── Register ─────────────────────────────────────────
const register = async (data) => {
    const { firstName, lastName, email, password, phone, businessName } = data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new ApiError(409, "An account with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and wallet in a transaction
    const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
                businessName,
            },
        });

        // Auto create wallet for new user
        await tx.wallet.create({
            data: { userId: newUser.id },
        });

        return newUser;
    });

    // Generate OTP and save
    const otp = generateOTP();
    const expiresAt = dayjs().add(10, "minutes").toDate();

    await prisma.emailVerificationToken.create({
        data: {
            userId: user.id,
            token: otp,
            expiresAt,
        },
    });

    // Send verification email
    await sendVerificationEmail(user.email, user.firstName, otp);

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    };
};

// ─── Verify Email ─────────────────────────────────────
const verifyEmail = async (email, otp) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ApiError(404, "User not found");
    if (user.isVerified) throw new ApiError(400, "Email already verified");

    const tokenRecord = await prisma.emailVerificationToken.findFirst({
        where: { userId: user.id, token: otp },
    });

    if (!tokenRecord) throw new ApiError(400, "Invalid verification code");
    if (dayjs().isAfter(tokenRecord.expiresAt)) {
        throw new ApiError(400, "Verification code has expired");
    }

    // Mark user as verified and delete token
    await prisma.$transaction([
        prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true },
        }),
        prisma.emailVerificationToken.deleteMany({
            where: { userId: user.id },
        }),
    ]);

    return { message: "Email verified successfully" };
};

// ─── Login ────────────────────────────────────────────
const login = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ApiError(401, "Invalid email or password");
    if (!user.isActive) throw new ApiError(403, "Your account has been suspended");
    if (!user.isVerified) throw new ApiError(403, "Please verify your email first");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return {
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
};

// ─── Forgot Password ──────────────────────────────────
const forgotPassword = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success even if email doesn't exist
    // This prevents email enumeration attacks
    if (!user) return { message: "If this email exists you will receive a reset code" };

    // Delete any existing reset tokens
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const otp = generateOTP();
    const expiresAt = dayjs().add(10, "minutes").toDate();

    await prisma.passwordResetToken.create({
        data: { userId: user.id, token: otp, expiresAt },
    });

    await sendPasswordResetEmail(user.email, user.firstName, otp);

    return { message: "If this email exists you will receive a reset code" };
};

// ─── Reset Password ───────────────────────────────────
const resetPassword = async (email, otp, newPassword) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ApiError(404, "User not found");

    const tokenRecord = await prisma.passwordResetToken.findFirst({
        where: { userId: user.id, token: otp },
    });

    if (!tokenRecord) throw new ApiError(400, "Invalid reset code");
    if (dayjs().isAfter(tokenRecord.expiresAt)) {
        throw new ApiError(400, "Reset code has expired");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
        prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        }),
        prisma.passwordResetToken.deleteMany({
            where: { userId: user.id },
        }),
    ]);

    return { message: "Password reset successfully" };
};

module.exports = { register, verifyEmail, login, forgotPassword, resetPassword };