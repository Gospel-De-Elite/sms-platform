import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { User, Lock } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import useAuthStore from "../../store/authStore";
import api from "../../services/axios";
import PasswordInput from "../../components/shared/PasswordInput";

export default function Settings() {
    const { user, updateUser } = useAuthStore();
    const queryClient = useQueryClient();

    const [profileForm, setProfileForm] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
        businessName: user?.businessName || "",
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
    });

    const profileMutation = useMutation({
        mutationFn: (data) => api.put("/user/profile", data),
        onSuccess: (response) => {
            updateUser(response.data.data);
            toast.success("Profile updated successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update profile");
        },
    });

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
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

                {/* Profile Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <User size={16} className="text-blue-500" />
                        </div>
                        <h2 className="text-white font-semibold">Profile Information</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm text-slate-400">First Name</label>
                                <input
                                    type="text"
                                    value={profileForm.firstName}
                                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm text-slate-400">Last Name</label>
                                <input
                                    type="text"
                                    value={profileForm.lastName}
                                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">Phone Number</label>
                            <input
                                type="tel"
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">Business Name</label>
                            <input
                                type="text"
                                value={profileForm.businessName}
                                onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">Email Address</label>
                            <input
                                type="email"
                                value={user?.email}
                                disabled
                                className="w-full bg-slate-800/50 border border-slate-700 text-slate-500 rounded-lg px-4 py-2.5 text-sm cursor-not-allowed"
                            />
                            <p className="text-slate-600 text-xs">Email cannot be changed</p>
                        </div>

                        <button
                            onClick={() => profileMutation.mutate(profileForm)}
                            disabled={profileMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg px-6 py-2.5 text-sm transition"
                        >
                            {profileMutation.isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>

                {/* Password Section */}
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
                            <PasswordInput
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">New Password</label>
                            <PasswordInput
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                placeholder="Min 8 chars, 1 uppercase, 1 number"
                            />
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
        </DashboardLayout>
    );
}