const apiKeyService = require("../services/apiKey.service");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const createApiKeyController = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) return next(new ApiError(400, "API key name is required"));

        const apiKey = await apiKeyService.createApiKey(req.user.id, name);

        res.status(201).json(
            new ApiResponse(201,
                "API key created. Copy it now — it won't be shown again.",
                apiKey
            )
        );
    } catch (error) {
        next(error);
    }
};

const getApiKeysController = async (req, res, next) => {
    try {
        const keys = await apiKeyService.getUserApiKeys(req.user.id);
        res.status(200).json(new ApiResponse(200, "API keys fetched", keys));
    } catch (error) {
        next(error);
    }
};

const deleteApiKeyController = async (req, res, next) => {
    try {
        await apiKeyService.deleteApiKey(req.user.id, req.params.keyId);
        res.status(200).json(new ApiResponse(200, "API key deleted"));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createApiKeyController,
    getApiKeysController,
    deleteApiKeyController,
};