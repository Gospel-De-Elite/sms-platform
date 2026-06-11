import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { User, Lock } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import useAuthStore from "../../store/authStore";
import api from "../../services/axios";

export default function AdminSettings() {
    const { admin, setAuth, token } = useAuthStore();
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
    });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const passwordMutation = useMutation({
        mutationFn: (data) => api.put("/user/change-password", data),
        onSuccess: () => {
            toast.success("Password changed successfully");
            setPasswordForm({ currentPassword: "", newPassword: "" });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to change password");
        },
    });

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

                {/* Admin Info */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <User size={16} className="text-blue-500" />
                        </div>
                        <h2 className="text-white font-semibold">Admin Profile</h2>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-3 border-b border-slate-800">
                            <span className="text-slate-400 text-sm">Name</span>
                            <span className="text-white text-sm">
                                {admin?.firstName} {admin?.lastName}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-slate-800">
                            <span className="text-slate-400 text-sm">Email</span>
                            <span className="text-white text-sm">{admin?.email}</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="text-slate-400 text-sm">Role</span>
                            <span className="bg-blue-500/10 text-blue-500 text-xs px-2.5 py-1 rounded-full">
                                {admin?.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <Lock size={16} className="text-purple-500" />
                        </div>
                        <h2 className="text-white font-semibold">Change Password</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({
                                        ...passwordForm,
                                        currentPassword: e.target.value,
                                    })}
                                    placeholder="Enter current password"
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                >
                                    {showCurrent ? "🙈" : "👁"}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({
                                        ...passwordForm,
                                        newPassword: e.target.value,
                                    })}
                                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                >
                                    {showNew ? "🙈" : "👁"}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => passwordMutation.mutate(passwordForm)}
                            disabled={passwordMutation.isPending}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium rounded-lg px-6 py-2.5 text-sm transition"
                        >
                            {passwordMutation.isPending ? "Changing..." : "Change Password"}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}