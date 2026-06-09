import api from "./axios";

export const getWallet = async () => {
    const response = await api.get("/wallet");
    return response.data;
};

export const getTransactions = async (page = 1, limit = 20) => {
    const response = await api.get(`/wallet/transactions?page=${page}&limit=${limit}`);
    return response.data;
};

export const initializePaystack = async (amount) => {
    const response = await api.post("/wallet/fund/paystack", { amount });
    return response.data;
};

export const initializeMonnify = async (amount) => {
    const response = await api.post("/wallet/fund/monnify", { amount });
    return response.data;
};

export const verifyPaystack = async (reference) => {
    const response = await api.get(`/wallet/verify/paystack?reference=${reference}`);
    return response.data;
};