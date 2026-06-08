import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { verifyEmail } from "../../services/authService";

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const [otp, setOtp] = useState("");

    const { mutate, isPending } = useMutation({
        mutationFn: verifyEmail,
        onSuccess: () => {
            toast.success("Email verified successfully!");
            navigate("/login");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Verification failed");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate({ email, otp });
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">SMS<span className="text-blue-500">Pro</span></h1>
                    <p className="text-slate-400 mt-2">Verify your email</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-slate-300 text-sm">
                            We sent a 6-digit code to <span className="text-white font-medium">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">Verification Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                required
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition text-center tracking-widest text-lg"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition"
                        >
                            {isPending ? "Verifying..." : "Verify Email"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}