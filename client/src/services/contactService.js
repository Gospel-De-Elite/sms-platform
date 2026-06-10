import api from "./axios";

export const getGroups = async () => {
  const response = await api.get("/contacts/groups");
  return response.data;
};

export const createGroup = async (data) => {
  const response = await api.post("/contacts/groups", data);
  return response.data;
};

export const deleteGroup = async (id) => {
  const response = await api.delete(`/contacts/groups/${id}`);
  return response.data;
};

export const getContacts = async (page = 1, limit = 20, groupId = null) => {
  const url = groupId
    ? `/contacts?page=${page}&limit=${limit}&groupId=${groupId}`
    : `/contacts?page=${page}&limit=${limit}`;
  const response = await api.get(url);
  return response.data;
};

export const createContact = async (data) => {
  const response = await api.post("/contacts", data);
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};