import api from "./axios";

export const getAllTransactions = async (page = 1, limit = 20) => {
    const response = await api.get(`/admin/transactions?page=${page}&limit=${limit}`);
    return response.data;
};