import api from "./axios";

// ─── Users ────────────────────────────────────────────
export const getUsers = async (page = 1, limit = 20) => {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
};

export const getUserById = async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
};

export const toggleUserStatus = async (userId) => {
    const response = await api.put(`/admin/users/${userId}/toggle-status`);
    return response.data;
};

// ─── Wallet ───────────────────────────────────────────
export const creditUserWallet = async (userId, data) => {
    const response = await api.post(`/admin/users/${userId}/wallet/credit`, data);
    return response.data;
};

export const debitUserWallet = async (userId, data) => {
    const response = await api.post(`/admin/users/${userId}/wallet/debit`, data);
    return response.data;
};

// ─── Stats ────────────────────────────────────────────
export const getPlatformStats = async () => {
    const response = await api.get("/admin/stats");
    return response.data;
};
export const getPendingSenderIDs = async () => {
    const response = await api.get("/admin/sender-ids/pending");
    return response.data;
};

export const approveSenderID = async (id) => {
    const response = await api.put(`/admin/sender-ids/${id}/approve`);
    return response.data;
};

export const rejectSenderID = async (id, data) => {
    const response = await api.put(`/admin/sender-ids/${id}/reject`, data);
    return response.data;
};