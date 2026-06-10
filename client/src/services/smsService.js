import api from "./axios";

export const sendSingleSMS = async (data) => {
  const response = await api.post("/sms/send", data);
  return response.data;
};

export const sendBulkSMS = async (data) => {
  const response = await api.post("/sms/send/bulk", data);
  return response.data;
};

export const getCampaigns = async (page = 1, limit = 20) => {
  const response = await api.get(`/sms/campaigns?page=${page}&limit=${limit}`);
  return response.data;
};

export const getMessages = async (page = 1, limit = 20) => {
  const response = await api.get(`/sms/messages?page=${page}&limit=${limit}`);
  return response.data;
};

export const getCampaignMessages = async (campaignId) => {
  const response = await api.get(`/sms/campaigns/${campaignId}/messages`);
  return response.data;
};
export const getReports = async () => {
  const response = await api.get("/sms/reports");
  return response.data;
};