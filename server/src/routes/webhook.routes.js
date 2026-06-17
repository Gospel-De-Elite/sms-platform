const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
    createWebhookController,
    getWebhooksController,
    deleteWebhookController,
} = require("../controllers/webhook.controller");

router.post("/", protect, createWebhookController);
router.get("/", protect, getWebhooksController);
router.delete("/:webhookId", protect, deleteWebhookController);

module.exports = router;