export const verifyUser = async (userId) => {
    const response = await api.put(`/admin/users/${userId}/verify`);
    return response.data;
};