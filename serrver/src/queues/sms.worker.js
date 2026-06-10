const smsQueue = require("./sms.queue");
const { processCampaign } = require("../services/sms.service");

smsQueue.process(async (job) => {
    const { campaignId, recipients } = job.data;
    console.log(`Processing campaign ${campaignId} with ${recipients.length} recipients`);
    await processCampaign(campaignId, recipients);
    console.log(`Campaign ${campaignId} completed`);
});

smsQueue.on("failed", (job, err) => {
    console.error(`Campaign job ${job.id} failed:`, err.message);
});

smsQueue.on("completed", (job) => {
    console.log(`Campaign job ${job.id} completed successfully`);
});

module.exports = smsQueue;