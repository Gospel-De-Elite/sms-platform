import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { loginUser } from "../../services/authService";
import useAuthStore from "../../store/authStore";
import PasswordInput from "../../components/shared/PasswordInput";
export default function Login() {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [formData, setFormData] = useState({ email: "", password: "" });

    const { mutate, isPending } = useMutation({
        mutationFn: loginUser,
        onSuccess: (response) => {
            const { user, accessToken, refreshToken } = response.data;
            setAuth(user, accessToken, refreshToken);
            toast.success(`Welcome back, ${user.firstName}!`);
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
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">SMS<span className="text-blue-500">Pro</span></h1>
                    <p className="text-slate-400 mt-2">Sign in to your account</p>
                </div>

                {/* Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                required
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        {/* Password */}
                        // Replace the password input field with:
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-slate-400">Password</label>
                                <Link to="/forgot-password" className="text-xs text-blue-500 hover:text-blue-400">
                                    Forgot password?
                                </Link>
                            </div>
                            <PasswordInput
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                            />
                        </div>
                        {/* Submit */}
                        <button
                            type="button"
                            onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
                            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium rounded-lg py-2.5 text-sm transition flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                        {/* Divider */}
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-slate-900 px-2 text-slate-500">or continue with</span>
                            </div>
                        </div>

                        {/* Google Button */}
                        <button
                            type="button"
                            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium rounded-lg py-2.5 text-sm transition flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </form>

                    <p className="text-center text-slate-400 text-sm mt-6">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}