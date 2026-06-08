import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import api from "../../services/axios";

export default function GoogleSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setAuth } = useAuthStore();

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
        const firstName = searchParams.get("firstName");

        if (accessToken && refreshToken) {
            // Fetch full user profile
            api.get("/user/profile", {
                headers: { Authorization: `Bearer ${accessToken}` },
            }).then((res) => {
                setAuth(res.data.data, accessToken, refreshToken);
                toast.success(`Welcome, ${firstName}!`);
                navigate("/dashboard");
            }).catch(() => {
                toast.error("Google sign in failed");
                navigate("/login");
            });
        } else {
            navigate("/login");
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Completing sign in...</p>
            </div>
        </div>
    );
}