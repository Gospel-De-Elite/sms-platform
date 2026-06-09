import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { loginAdmin } from "../../services/authService";
import useAuthStore from "../../store/authStore";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [formData, setFormData] = useState({ email: "", password: "" });

    const { mutate, isPending } = useMutation({
        mutationFn: loginAdmin,
        onSuccess: (response) => {
            const { user, accessToken } = response.data;
            if (user.role !== "ADMIN") {
                toast.error("Access denied. Admins only.");
                return;
            }
            setAuth(user, accessToken);
            toast.success("Welcome back!");
            navigate("/dashboard");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Login failed");
        },
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate(formData);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        SMS<span className="text-blue-500">Pro</span>
                    </h1>
                    <p className="text-slate-400 mt-2">Admin Panel</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@smspro.com"
                                required
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg py-2.5 text-sm transition"
                        >
                            {isPending ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}