import { create } from "zustand";

const useAuthStore = create((set) => ({
    admin: null,
    token: localStorage.getItem("adminToken") || null,
    isAuthenticated: !!localStorage.getItem("adminToken"),

    setAuth: (admin, token) => {
        localStorage.setItem("adminToken", token);
        set({ admin, token, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem("adminToken");
        set({ admin: null, token: null, isAuthenticated: false });
    },
}));

export default useAuthStore;