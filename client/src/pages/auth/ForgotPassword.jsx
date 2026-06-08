import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { forgotPassword } from "../../services/authService";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: forgotPassword,
        onSuccess: () => {
            setSent(true);
            toast.success("Reset code sent if email exists");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate({ email });
    };

    if (sent) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">SMS<span className="text-blue-500">Pro</span></h1>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-white font-semibold text-lg mb-2">Check your email</h2>
                        <p className="text-slate-400 text-sm mb-6">
                            If an account exists for <span className="text-white">{email}</span>, you'll receive a reset code shortly.
                        </p>
                        <Link
                            to="/reset-password"
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2.5 text-sm transition text-center"
                        >
                            Enter Reset Code
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">SMS<span className="text-blue-500">Pro</span></h1>
                    <p className="text-slate-400 mt-2">Reset your password</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                required
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition"
                        >
                            {isPending ? "Sending..." : "Send Reset Code"}
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