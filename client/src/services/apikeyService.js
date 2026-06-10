import api from "./axios";

export const getApiKeys = async () => {
    const response = await api.get("/api-keys");
    return response.data;
};

export const createApiKey = async (data) => {
    const response = await api.post("/api-keys", data);
    return response.data;
};

export const deleteApiKey = async (id) => {
    const response = await api.delete(`/api-keys/${id}`);
    return response.data;
};