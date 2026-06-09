import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import AdminLayout from "../../layouts/AdminLayout";
import {
    getUsers,
    toggleUserStatus,
    creditUserWallet,
    debitUserWallet,
} from "../../services/adminService";

export default function Users() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [walletAction, setWalletAction] = useState(null);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["users", page],
        queryFn: () => getUsers(page, 20),
    });

    const users = data?.data?.users || [];
    const pagination = data?.data?.pagination;

    const toggleMutation = useMutation({
        mutationFn: (userId) => toggleUserStatus(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User status updated");
        },
        onError: () => toast.error("Failed to update user status"),
    });

    const walletMutation = useMutation({
        mutationFn: ({ userId, type, amount, description }) =>
            type === "credit"
                ? creditUserWallet(userId, { amount, description })
                : debitUserWallet(userId, { amount, description }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success(`Wallet ${walletAction} successful`);
            setSelectedUser(null);
            setWalletAction(null);
            setAmount("");
            setDescription("");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Wallet action failed");
        },
    });

    const handleWalletSubmit = () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Enter a valid amount");
            return;
        }
        walletMutation.mutate({
            userId: selectedUser.id,
            type: walletAction,
            amount: parseFloat(amount),
            description,
        });
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-white mb-6">Users</h1>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-slate-400">Loading...</div>
                ) : (
                    <>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">User</th>
                                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Balance</th>
                                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Status</th>
                                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Joined</th>
                                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                                        <td className="px-6 py-4">
                                            <p className="text-white text-sm font-medium">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p className="text-slate-500 text-xs">{user.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white text-sm">
                                                ₦{parseFloat(user.wallet?.balance || 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${user.isActive
                                                    ? "bg-green-500/10 text-green-500"
                                                    : "bg-red-500/10 text-red-500"
                                                }`}>
                                                {user.isActive ? "Active" : "Suspended"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-400 text-sm">
                                                {dayjs(user.createdAt).format("MMM D, YYYY")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setWalletAction("credit");
                                                    }}
                                                    className="text-xs bg-green-500/10 text-green-500 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition"
                                                >
                                                    Credit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setWalletAction("debit");
                                                    }}
                                                    className="text-xs bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition"
                                                >
                                                    Debit
                                                </button>
                                                <button
                                                    onClick={() => toggleMutation.mutate(user.id)}
                                                    className="text-xs bg-slate-700 text-slate-300 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition"
                                                >
                                                    {user.isActive ? "Suspend" : "Activate"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
                                <p className="text-slate-400 text-sm">
                                    Page {pagination.page} of {pagination.totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-700 transition"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === pagination.totalPages}
                                        className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-700 transition"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Wallet Action Modal */}
            {selectedUser && walletAction && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-white font-semibold text-lg mb-1 capitalize">
                            {walletAction} Wallet
                        </h2>
                        <p className="text-slate-400 text-sm mb-6">
                            {selectedUser.firstName} {selectedUser.lastName} —
                            Balance: ₦{parseFloat(selectedUser.wallet?.balance || 0).toLocaleString()}
                        </p>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm text-slate-400">Amount (₦)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-slate-400">Description (optional)</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Reason for adjustment"
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedUser(null);
                                        setWalletAction(null);
                                        setAmount("");
                                        setDescription("");
                                    }}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg py-2.5 text-sm transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleWalletSubmit}
                                    disabled={walletMutation.isPending}
                                    className={`flex-1 text-white rounded-lg py-2.5 text-sm transition ${walletAction === "credit"
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-red-600 hover:bg-red-700"
                                        }`}
                                >
                                    {walletMutation.isPending ? "Processing..." : `Confirm ${walletAction}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}