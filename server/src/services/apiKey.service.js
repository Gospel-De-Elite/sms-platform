const crypto = require("crypto");
const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");

// Generate a secure API key
const generateApiKey = () => {
  return `sms_${crypto.randomBytes(32).toString("hex")}`;
};

// Hash the key for storage
const hashApiKey = (key) => {
  return crypto.createHash("sha256").update(key).digest("hex");
};

const createApiKey = async (userId, name) => {
  const existingKeys = await prisma.apiKey.count({ where: { userId } });
  if (existingKeys >= 5) {
    throw new ApiError(400, "Maximum of 5 API keys allowed");
  }

  const rawKey = generateApiKey();
  const hashedKey = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.create({
    data: {
      userId,
      name,
      key: hashedKey,
    },
  });

  // Return raw key only once — never stored in plain text
  return { ...apiKey, key: rawKey };
};

const getUserApiKeys = async (userId) => {
  return await prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      isActive: true,
      lastUsedAt: true,
      createdAt: true,
      // Never return the hashed key
    },
  });
};

const deleteApiKey = async (userId, keyId) => {
  const key = await prisma.apiKey.findFirst({
    where: { id: keyId, userId },
  });
  if (!key) throw new ApiError(404, "API key not found");

  await prisma.apiKey.delete({ where: { id: keyId } });
};

const validateApiKey = async (rawKey) => {
  const hashedKey = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.findFirst({
    where: { key: hashedKey, isActive: true },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
          isVerified: true,
        },
      },
    },
  });

  if (!apiKey) throw new ApiError(401, "Invalid API key");
  if (!apiKey.user.isActive) throw new ApiError(403, "Account suspended");

  // Update last used
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return apiKey;
};

module.exports = {
  createApiKey,
  getUserApiKeys,
  deleteApiKey,
  validateApiKey,
  hashApiKey,
};