const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
    createApiKeyController,
    getApiKeysController,
    deleteApiKeyController,
} = require("../controllers/apiKey.controller");

router.post("/", protect, createApiKeyController);
router.get("/", protect, getApiKeysController);
router.delete("/:keyId", protect, deleteApiKeyController);

module.exports = router;