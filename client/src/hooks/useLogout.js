import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser } from "../services/authService";
import useAuthStore from "../store/authStore";

export const useLogout = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const { mutate, isPending } = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            logout();
            toast.success("Logged out successfully");
            navigate("/login");
        },
        onError: () => {
            // Even if API call fails, clear local state
            logout();
            navigate("/login");
        },
    });

    return { logout: mutate, isPending };
};