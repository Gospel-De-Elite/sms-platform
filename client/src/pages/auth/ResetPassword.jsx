import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { resetPassword } from "../../services/authService";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        password: "",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            toast.success("Password reset successfully!");
            navigate("/login");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Reset failed");
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
                    <h1 className="text-3xl font-bold text-white">SMS<span className="text-blue-500">Pro</span></h1>
                    <p className="text-slate-400 mt-2">Create a new password</p>
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
                                placeholder="john@example.com"
                                required
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">Reset Code</label>
                            <input
                                type="text"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                required
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition text-center tracking-widest"
                            />
                        </div>

                        import PasswordInput from "../../components/shared/PasswordInput";

                        // Replace the new password input field with:
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">New Password</label>
                            <PasswordInput
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Min 8 chars, 1 uppercase, 1 number"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition"
                        >
                            {isPending ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <p className="text-center text-slate-400 text-sm mt-6">
                        Remember your password?{" "}
                        <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}