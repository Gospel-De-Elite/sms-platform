const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/error.middleware");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const passport = require("./config/passport");
const googleAuthRoutes = require("./routes/googleAuth.routes");
const walletRoutes = require("./routes/wallet.routes");
const adminRoutes = require("./routes/admin.routes");
const smsRoutes = require("./routes/sms.routes");
const contactRoutes = require("./routes/contact.routes");
const senderIDRoutes = require("./routes/senderID.routes");
const apiKeyRoutes = require("./routes/apiKey.routes");
const developerRoutes = require("./routes/developer.routes");
const webhookRoutes = require("./routes/webhook.routes");
const { authLimiter, apiLimiter, generalLimiter } = require("./middlewares/rateLimit.middleware");
const providerWebhookRoutes = require("./routes/providerWebhook.routes");
dotenv.config();

const app = express();

// ─── Core Middleware ──────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ─── Routes ───────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/sender-ids", senderIDRoutes);
app.use("/api/api-keys", apiKeyRoutes);
app.use("/v1", developerRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/webhooks/provider", providerWebhookRoutes);
// Apply rate limits
app.use("/api/auth", authLimiter);
app.use("/v1", apiLimiter);
app.use("/api", generalLimiter);
// Start SMS queue worker
require("./queues/sms.worker");

// ─── Health Check ─────────────────────────────────────
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SMS Platform API is running",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// ─── 404 Handler ──────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;