const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
    sendSingleController,
    sendBulkController,
    getCampaignsController,
    getCampaignMessagesController,
    getMessagesController,
    getReportsController,
} = require("../controllers/sms.controller");

router.post("/send", protect, sendSingleController);
router.post("/send/bulk", protect, sendBulkController);
router.get("/campaigns", protect, getCampaignsController);
router.get("/campaigns/:campaignId/messages", protect, getCampaignMessagesController);
router.get("/messages", protect, getMessagesController);
router.get("/reports", protect, getReportsController);
module.exports = router;