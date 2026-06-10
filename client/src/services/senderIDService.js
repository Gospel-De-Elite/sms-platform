import api from "./axios";

export const getSenderIDs = async () => {
  const response = await api.get("/sender-ids");
  return response.data;
};

export const createSenderID = async (data) => {
  const response = await api.post("/sender-ids", data);
  return response.data;
};

export const deleteSenderID = async (id) => {
  const response = await api.delete(`/sender-ids/${id}`);
  return response.data;
};