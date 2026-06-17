const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");
const { v4: uuidv4 } = require("uuid");

// ─── Get Wallet ───────────────────────────────────────
const getWallet = async (userId) => {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });
  if (!wallet) throw new ApiError(404, "Wallet not found");
  return wallet;
};

// ─── Credit Wallet ────────────────────────────────────
const creditWallet = async (userId, amount, description, paymentGateway, gatewayRef) => {
  return await prisma.$transaction(async (tx) => {
    // Lock wallet row
    const wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new ApiError(404, "Wallet not found");

    const balanceBefore = parseFloat(wallet.balance);
    const balanceAfter = balanceBefore + parseFloat(amount);

    // Update wallet
    await tx.wallet.update({
      where: { userId },
      data: {
        balance: balanceAfter,
        totalFunded: parseFloat(wallet.totalFunded) + parseFloat(amount),
      },
    });

    // Record transaction
    const transaction = await tx.transaction.create({
      data: {
        userId,
        type: "CREDIT",
        amount: parseFloat(amount),
        balanceBefore,
        balanceAfter,
        description,
        reference: uuidv4(),
        status: "SUCCESS",
        paymentGateway,
        gatewayRef,
      },
    });

    return transaction;
  });
};

// ─── Debit Wallet ─────────────────────────────────────
const debitWallet = async (userId, amount, description) => {
  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new ApiError(404, "Wallet not found");

    const balanceBefore = parseFloat(wallet.balance);

    if (balanceBefore < parseFloat(amount)) {
      throw new ApiError(400, "Insufficient wallet balance");
    }

    const balanceAfter = balanceBefore - parseFloat(amount);

    await tx.wallet.update({
      where: { userId },
      data: {
        balance: balanceAfter,
        totalSpent: parseFloat(wallet.totalSpent) + parseFloat(amount),
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        userId,
        type: "DEBIT",
        amount: parseFloat(amount),
        balanceBefore,
        balanceAfter,
        description,
        reference: uuidv4(),
        status: "SUCCESS",
      },
    });

    return transaction;
  });
};

// ─── Get Transactions ─────────────────────────────────
const getTransactions = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where: { userId } }),
  ]);

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { getWallet, creditWallet, debitWallet, getTransactions };