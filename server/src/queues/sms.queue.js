const Bull = require("bull");

const smsQueue = new Bull("sms-campaigns", {
    redis: process.env.REDIS_URL || "redis://localhost:6379",
});

module.exports = smsQueue;